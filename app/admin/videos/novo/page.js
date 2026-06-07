'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { supabase } from '../../../../lib/supabase'
import { Lexend } from 'next/font/google'
import { useAuth } from '../../../components/AuthContext'

const lexend = Lexend({ subsets: ['latin'], weight: '700' })
const ADMIN_ID = 'b20f6b3d-9e42-4445-a4a5-6509aee5bcb5'
const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: 'white', color: '#111' }
const labelStyle = { fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '6px' }

function slugify(t) {
  return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}
function extrairYoutubeId(url) {
  if (!url) return ''
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/)
  if (m) return m[1]
  if (/^[A-Za-z0-9_-]{11}$/.test(url.trim())) return url.trim()
  return ''
}

export default function NovoVideo() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [f, setF] = useState({ titulo: '', linkOuId: '', categoria: '', publicado: false })
  const [salvando, setSalvando] = useState(false)
  const [msg, setMsg] = useState('')

  const editor = useEditor({
    extensions: [StarterKit, Image, Link.configure({ openOnClick: false }), Placeholder.configure({ placeholder: 'Descrição do vídeo...' })],
    content: '',
  })

  useEffect(function() {
    if (authLoading) return
    if (!user || user.id !== ADMIN_ID) router.replace('/admin')
  }, [user, authLoading])

  function set(c, v) { setF(function(p){ return Object.assign({}, p, { [c]: v }) }) }

  async function salvar() {
    const ytId = extrairYoutubeId(f.linkOuId)
    if (!f.titulo || !ytId) { setMsg('Preencha o título e um link válido do YouTube.'); return }
    setSalvando(true)
    const { error } = await supabase.from('videos').insert({
      titulo: f.titulo, slug: slugify(f.titulo), descricao: editor ? editor.getHTML() : '',
      youtube_id: ytId, categoria: f.categoria, publicado: f.publicado,
    })
    setSalvando(false)
    if (error) setMsg('Erro ao salvar: ' + error.message)
    else router.push('/admin/videos')
  }

  return <FormVideo f={f} set={set} salvar={salvar} salvando={salvando} msg={msg} router={router} titulo='Novo Vídeo' extrairYoutubeId={extrairYoutubeId} editor={editor} />
}

function BarraEditor({ editor }) {
  if (!editor) return null
  const botoes = [
    { label: 'B', action: function(){ editor.chain().focus().toggleBold().run() } },
    { label: 'I', action: function(){ editor.chain().focus().toggleItalic().run() } },
    { label: 'H2', action: function(){ editor.chain().focus().toggleHeading({ level: 2 }).run() } },
    { label: 'H3', action: function(){ editor.chain().focus().toggleHeading({ level: 3 }).run() } },
    { label: '• Lista', action: function(){ editor.chain().focus().toggleBulletList().run() } },
    { label: 'Link', action: function(){ const u = prompt('URL:'); if (u) editor.chain().focus().setLink({ href: u }).run() } },
  ]
  return (
    <div style={{ display: 'flex', gap: '4px', padding: '10px 12px', borderBottom: '1px solid #e5e7eb', flexWrap: 'wrap' }}>
      {botoes.map(function(b, i) {
        return <button key={i} onClick={b.action} style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #e5e7eb', fontSize: '12px', cursor: 'pointer', background: 'white', color: 'black' }}>{b.label}</button>
      })}
    </div>
  )
}

function FormVideo({ f, set, salvar, salvando, msg, router, titulo, extrairYoutubeId, editor }) {
  const preview = extrairYoutubeId(f.linkOuId)
  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <div style={{ background: 'black', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 className={lexend.className} style={{ color: 'white', fontSize: '20px', letterSpacing: '-0.06em' }}>{titulo}</h1>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', fontSize: '13px', cursor: 'pointer' }}>
            <input type='checkbox' checked={f.publicado} onChange={function(e){ set('publicado', e.target.checked) }} />
            Publicar
          </label>
          <button onClick={function(){ router.push('/admin/videos') }} style={{ background: 'transparent', color: '#9ca3af', border: '1px solid #374151', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer' }}>Cancelar</button>
          <button onClick={salvar} disabled={salvando} style={{ background: 'white', color: 'black', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', fontWeight: '700' }}>{salvando ? 'Salvando...' : 'Salvar'}</button>
        </div>
      </div>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '32px 16px' }}>
        {msg && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '12px', marginBottom: '16px', fontSize: '14px' }}>{msg}</div>}

        <label style={labelStyle}>Título *</label>
        <input value={f.titulo} onChange={function(e){ set('titulo', e.target.value) }} placeholder='Ex: Surf Adventures - O Filme' style={Object.assign({}, inputStyle, { marginBottom: '16px' })} />

        <label style={labelStyle}>Link do YouTube *</label>
        <input value={f.linkOuId} onChange={function(e){ set('linkOuId', e.target.value) }} placeholder='Cole o link do YouTube aqui' style={Object.assign({}, inputStyle, { marginBottom: '8px' })} />
        {preview ? <img src={'https://img.youtube.com/vi/' + preview + '/mqdefault.jpg'} alt='preview' style={{ width: '200px', borderRadius: '10px', marginBottom: '16px' }} /> : f.linkOuId ? <p style={{ fontSize: '12px', color: '#dc2626', marginBottom: '16px' }}>Link não reconhecido.</p> : null}

        <label style={labelStyle}>Hashtags (separe por espaço, ex: #surf #filme)</label>
        <input value={f.categoria} onChange={function(e){ set('categoria', e.target.value) }} placeholder='#surf #filme' style={Object.assign({}, inputStyle, { marginBottom: '16px' })} />

        <label style={labelStyle}>Descrição</label>
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <BarraEditor editor={editor} />
          <div style={{ padding: '16px', minHeight: '240px' }}><EditorContent editor={editor} /></div>
        </div>
      </div>
      <style>{`
        .ProseMirror { outline: none; font-size: 15px; line-height: 1.7; color: #111; }
        .ProseMirror h2 { font-size: 22px; font-weight: 700; margin: 18px 0 8px; }
        .ProseMirror h3 { font-size: 18px; font-weight: 700; margin: 14px 0 6px; }
        .ProseMirror p { margin: 0 0 10px; }
        .ProseMirror ul { padding-left: 22px; margin: 10px 0; }
        .ProseMirror strong { font-weight: 700; }
        .ProseMirror a { color: #2563eb; text-decoration: underline; }
        .ProseMirror p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: #9ca3af; float: left; height: 0; pointer-events: none; }
      `}</style>
    </div>
  )
}

export { FormVideo, slugify, extrairYoutubeId, BarraEditor }
