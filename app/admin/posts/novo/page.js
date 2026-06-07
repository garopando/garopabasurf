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
const lexendNormal = Lexend({ subsets: ['latin'], weight: '400' })
const ADMIN_ID = 'b20f6b3d-9e42-4445-a4a5-6509aee5bcb5'

function slugify(text) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function NovoPost() {
  const [titulo, setTitulo] = useState('')
  const [resumo, setResumo] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [categoria, setCategoria] = useState('')
  const [publicado, setPublicado] = useState(false)
  const [dataPost, setDataPost] = useState(new Date().toISOString().slice(0, 16))
  const [salvando, setSalvando] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  useEffect(function() {
    if (authLoading) return
    if (!user || user.id !== ADMIN_ID) router.replace('/admin')
  }, [user, authLoading])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Escreva o conteúdo do post aqui...' }),
    ],
    content: '',
  })

  async function salvar() {
    if (!titulo || !editor.getHTML()) {
      setMensagem('Preencha o título e o conteúdo!')
      return
    }
    setSalvando(true)
    const { error } = await supabase.from('posts').insert({
      titulo,
      conteudo: editor.getHTML(),
      resumo,
      thumbnail,
      categoria,
      slug: slugify(titulo),
      publicado,
      criado_em: new Date(dataPost).toISOString(),
    })
    setSalvando(false)
    if (error) {
      setMensagem('Erro ao salvar: ' + error.message)
    } else {
      router.push('/admin/posts')
    }
  }

  function addImage() {
    const url = prompt('URL da imagem:')
    if (url) editor.chain().focus().setImage({ src: url }).run()
  }

  function addInstagram() {
    const url = prompt('Cole o link do post do Instagram:')
    if (!url) return
    const limpo = url.split('?')[0].replace(/\/$/, '') + '/'
    editor.chain().focus().insertContent('<p>' + limpo + '</p>').run()
  }

  function addLink() {
    const url = prompt('URL do link:')
    if (url) editor.chain().focus().setLink({ href: url }).run()
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <div style={{ background: 'black', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 className={lexend.className} style={{ color: 'white', fontSize: '20px', letterSpacing: '-0.06em' }}>Novo Post</h1>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', fontSize: '13px', cursor: 'pointer' }}>
            <input type='checkbox' checked={publicado} onChange={function(e) { setPublicado(e.target.checked) }} />
            Publicar
          </label>
          <button onClick={function() { router.push('/admin/posts') }}
            style={{ background: 'transparent', color: '#9ca3af', border: '1px solid #374151', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer' }}>
            Cancelar
          </button>
          <button onClick={salvar} disabled={salvando}
            style={{ background: 'white', color: 'black', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', fontWeight: '700' }}>
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 16px' }}>
        {mensagem && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '12px', marginBottom: '16px', fontSize: '14px' }}>{mensagem}</div>}

        <input
          type='text'
          placeholder='Título do post'
          value={titulo}
          onChange={function(e) { setTitulo(e.target.value) }}
          className={lexend.className}
          style={{ width: '100%', fontSize: '32px', letterSpacing: '-0.06em', border: 'none', background: 'transparent', outline: 'none', marginBottom: '24px', color: 'black', boxSizing: 'border-box' }}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>Tags (ex: #surf #garopaba)</label>
            <input type='text' placeholder='#surf #garopaba #ondas' value={categoria} onChange={function(e) { setCategoria(e.target.value) }}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: 'white', color: '#111' }} />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>URL da Thumbnail</label>
            <input type='text' placeholder='https://...' value={thumbnail} onChange={function(e) { setThumbnail(e.target.value) }}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: 'white', color: '#111' }} />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>Data da Notícia</label>
            <input type='datetime-local' value={dataPost} onChange={function(e) { setDataPost(e.target.value) }}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: 'white', color: '#111' }} />
          </div>
        </div>

        <div>
          <label style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>Resumo</label>
          <textarea placeholder='Breve descrição do post...' value={resumo} onChange={function(e) { setResumo(e.target.value) }}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '14px', outline: 'none', resize: 'vertical', minHeight: '80px', boxSizing: 'border-box', marginBottom: '24px', background: 'white', color: '#111' }} />
        </div>

        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: '4px', padding: '12px 16px', borderBottom: '1px solid #e5e7eb', flexWrap: 'wrap' }}>
            {[
              { label: 'B', action: function() { editor.chain().focus().toggleBold().run() }, active: editor && editor.isActive('bold') },
              { label: 'I', action: function() { editor.chain().focus().toggleItalic().run() }, active: editor && editor.isActive('italic') },
              { label: 'S', action: function() { editor.chain().focus().toggleStrike().run() }, active: editor && editor.isActive('strike') },
              { label: 'H1', action: function() { editor.chain().focus().toggleHeading({ level: 1 }).run() }, active: editor && editor.isActive('heading', { level: 1 }) },
              { label: 'H2', action: function() { editor.chain().focus().toggleHeading({ level: 2 }).run() }, active: editor && editor.isActive('heading', { level: 2 }) },
              { label: 'H3', action: function() { editor.chain().focus().toggleHeading({ level: 3 }).run() }, active: editor && editor.isActive('heading', { level: 3 }) },
              { label: '• Lista', action: function() { editor.chain().focus().toggleBulletList().run() }, active: editor && editor.isActive('bulletList') },
              { label: '1. Lista', action: function() { editor.chain().focus().toggleOrderedList().run() }, active: editor && editor.isActive('orderedList') },
              { label: 'Citação', action: function() { editor.chain().focus().toggleBlockquote().run() }, active: editor && editor.isActive('blockquote') },
              { label: 'Código', action: function() { editor.chain().focus().toggleCode().run() }, active: editor && editor.isActive('code') },
              { label: 'Imagem', action: addImage, active: false },
              { label: 'Link', action: addLink, active: editor && editor.isActive('link') },
              { label: '📷 Instagram', action: addInstagram, active: false },
              { label: '↩ Desfazer', action: function() { editor.chain().focus().undo().run() }, active: false },
              { label: '↪ Refazer', action: function() { editor.chain().focus().redo().run() }, active: false },
            ].map(function(btn, i) {
              return (
                <button key={i} onClick={btn.action}
                  style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #e5e7eb', fontSize: '12px', cursor: 'pointer', background: btn.active ? 'black' : 'white', color: btn.active ? 'white' : 'black', fontWeight: btn.label === 'B' ? '700' : '400', fontStyle: btn.label === 'I' ? 'italic' : 'normal' }}>
                  {btn.label}
                </button>
              )
            })}
          </div>
          <div style={{ padding: '24px', minHeight: '400px' }}>
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>

      <style>{`
        .ProseMirror { outline: none; font-size: 16px; line-height: 1.7; color: #111; }
        .ProseMirror h1 { font-size: 32px; font-weight: 700; margin: 24px 0 12px; }
        .ProseMirror h2 { font-size: 24px; font-weight: 700; margin: 20px 0 10px; }
        .ProseMirror h3 { font-size: 20px; font-weight: 700; margin: 16px 0 8px; }
        .ProseMirror p { margin: 0 0 12px; }
        .ProseMirror ul, .ProseMirror ol { padding-left: 24px; margin: 12px 0; }
        .ProseMirror blockquote { border-left: 4px solid #e5e7eb; padding-left: 16px; color: #6b7280; margin: 16px 0; }
        .ProseMirror code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 14px; }
        .ProseMirror img { max-width: 100%; border-radius: 8px; margin: 16px 0; }
        .ProseMirror a { color: #3b82f6; text-decoration: underline; }
        .ProseMirror p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: #9ca3af; pointer-events: none; float: left; height: 0; }
      `}</style>
    </div>
  )
}
