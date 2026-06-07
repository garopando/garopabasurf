'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { supabase } from '../../../../lib/supabase'
import { useAuth } from '../../../components/AuthContext'
import { FormVideo, slugify, extrairYoutubeId } from '../novo/page'

const ADMIN_ID = 'b20f6b3d-9e42-4445-a4a5-6509aee5bcb5'

export default function EditarVideo() {
  const { id } = useParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [f, setF] = useState(null)
  const [salvando, setSalvando] = useState(false)
  const [msg, setMsg] = useState('')

  const editor = useEditor({
    extensions: [StarterKit, Image, Link.configure({ openOnClick: false }), Placeholder.configure({ placeholder: 'Descrição do vídeo...' })],
    content: '',
  })

  useEffect(function() {
    if (authLoading) return
    if (!user || user.id !== ADMIN_ID) { router.replace('/admin'); return }
    if (!id || !editor) return
    supabase.from('videos').select('*').eq('id', id).single().then(function({ data }) {
      if (data) {
        setF({ titulo: data.titulo || '', linkOuId: data.youtube_id || '', categoria: data.categoria || '', publicado: data.publicado })
        editor.commands.setContent(data.descricao || '')
      }
    })
  }, [id, user, authLoading, editor])

  function set(c, v) { setF(function(p){ return Object.assign({}, p, { [c]: v }) }) }

  async function salvar() {
    const ytId = extrairYoutubeId(f.linkOuId)
    if (!f.titulo || !ytId) { setMsg('Preencha o título e um link válido do YouTube.'); return }
    setSalvando(true)
    const { error } = await supabase.from('videos').update({
      titulo: f.titulo, slug: slugify(f.titulo), descricao: editor ? editor.getHTML() : '',
      youtube_id: ytId, categoria: f.categoria, publicado: f.publicado,
    }).eq('id', id)
    setSalvando(false)
    if (error) setMsg('Erro ao salvar: ' + error.message)
    else router.push('/admin/videos')
  }

  if (!f) return <div style={{ padding: '100px', textAlign: 'center', color: '#9ca3af' }}>Carregando...</div>
  return <FormVideo f={f} set={set} salvar={salvar} salvando={salvando} msg={msg} router={router} titulo='Editar Vídeo' extrairYoutubeId={extrairYoutubeId} editor={editor} />
}
