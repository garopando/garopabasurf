'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '../../../../lib/supabase'
import { Lexend } from 'next/font/google'
import { useAuth } from '../../../components/AuthContext'
import { FormEvento } from '../novo/page'

const lexend = Lexend({ subsets: ['latin'], weight: '700' })
const ADMIN_ID = 'b20f6b3d-9e42-4445-a4a5-6509aee5bcb5'

export default function EditarEvento() {
  const { id } = useParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [f, setF] = useState(null)
  const [salvando, setSalvando] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(function() {
    if (authLoading) return
    if (!user || user.id !== ADMIN_ID) { router.replace('/admin'); return }
    if (!id) return
    supabase.from('eventos').select('*').eq('id', id).single().then(function({ data }) {
      if (data) {
        setF({
          titulo: data.titulo || '', descricao: data.descricao || '', local: data.local || '',
          data_inicio: data.data_inicio || '', data_fim: data.data_fim || '', hora: data.hora || '',
          tipo: data.tipo || 'Campeonato', thumbnail: data.thumbnail || '', link: data.link || '', publicado: data.publicado,
        })
      }
    })
  }, [id, user, authLoading])

  function set(campo, valor) { setF(function(p) { return Object.assign({}, p, { [campo]: valor }) }) }

  async function salvar() {
    if (!f.titulo || !f.data_inicio) { setMsg('Preencha ao menos o título e a data de início.'); return }
    setSalvando(true)
    const { error } = await supabase.from('eventos').update({
      titulo: f.titulo, descricao: f.descricao, local: f.local,
      data_inicio: f.data_inicio, data_fim: f.data_fim || null, hora: f.hora,
      tipo: f.tipo, thumbnail: f.thumbnail, link: f.link, publicado: f.publicado,
    }).eq('id', id)
    setSalvando(false)
    if (error) setMsg('Erro ao salvar: ' + error.message)
    else router.push('/admin/eventos')
  }

  if (!f) return <div style={{ padding: '100px', textAlign: 'center', color: '#9ca3af' }}>Carregando...</div>

  return <FormEvento f={f} set={set} salvar={salvar} salvando={salvando} msg={msg} router={router} titulo='Editar Evento' />
}
