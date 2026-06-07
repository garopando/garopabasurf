'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from './AuthContext'
import { Lexend } from 'next/font/google'

const lexend = Lexend({ subsets: ['latin'], weight: '700' })
const ADMIN_ID = 'b20f6b3d-9e42-4445-a4a5-6509aee5bcb5'

function tempoAtras(data) {
  const seg = Math.floor((Date.now() - new Date(data)) / 1000)
  if (seg < 60) return 'agora'
  if (seg < 3600) return Math.floor(seg/60) + 'min'
  if (seg < 86400) return Math.floor(seg/3600) + 'h'
  if (seg < 604800) return Math.floor(seg/86400) + 'd'
  return new Date(data).toLocaleDateString('pt-BR')
}

function Coracao({ ativo, n, onClick }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', color: ativo ? '#ef4444' : '#9ca3af', fontSize: '13px' }}>
      <svg width='16' height='16' viewBox='0 0 24 24' fill={ativo ? '#ef4444' : 'none'} stroke={ativo ? '#ef4444' : '#9ca3af'} strokeWidth='2'><path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'/></svg>
      {n > 0 && <span>{n}</span>}
    </button>
  )
}

export default function Comentarios({ postId }) {
  const { user, perfil, abrirModal } = useAuth()
  const [comentarios, setComentarios] = useState([])
  const [curtidasCom, setCurtidasCom] = useState({})
  const [curtiCom, setCurtiCom] = useState({})
  const [curtidasPost, setCurtidasPost] = useState(0)
  const [curtiPost, setCurtiPost] = useState(false)
  const [texto, setTexto] = useState('')
  const [respondendo, setRespondendo] = useState(null)
  const [textoResp, setTextoResp] = useState('')
  const [perfis, setPerfis] = useState({})

  useEffect(function() { carregar() }, [postId, user])

  async function carregar() {
    const { data: coms } = await supabase.from('comentarios').select('*').eq('post_id', postId).order('criado_em', { ascending: true })
    setComentarios(coms || [])

    // perfis dos autores
    if (coms && coms.length > 0) {
      const ids = Array.from(new Set(coms.map(function(c){return c.user_id})))
      const { data: ps } = await supabase.from('profiles').select('id, nome, avatar_url').in('id', ids)
      const mapa = {}
      ;(ps || []).forEach(function(p){ mapa[p.id] = p })
      setPerfis(mapa)
    }

    // curtidas de comentarios (contagem + se eu curti)
    const { data: cc } = await supabase.from('curtidas_comentarios').select('comentario_id, user_id')
    const cont = {}, meu = {}
    ;(cc || []).forEach(function(x){
      cont[x.comentario_id] = (cont[x.comentario_id] || 0) + 1
      if (user && x.user_id === user.id) meu[x.comentario_id] = true
    })
    setCurtidasCom(cont); setCurtiCom(meu)

    // curtidas do post
    const { data: cp } = await supabase.from('curtidas_posts').select('user_id').eq('post_id', postId)
    setCurtidasPost((cp || []).length)
    setCurtiPost(!!(user && (cp || []).some(function(x){return x.user_id === user.id})))
  }

  async function toggleCurtirPost() {
    if (!user) { abrirModal(); return }
    if (curtiPost) {
      setCurtiPost(false); setCurtidasPost(function(n){return n-1})
      await supabase.from('curtidas_posts').delete().eq('post_id', postId).eq('user_id', user.id)
    } else {
      setCurtiPost(true); setCurtidasPost(function(n){return n+1})
      await supabase.from('curtidas_posts').insert({ post_id: postId, user_id: user.id })
    }
  }

  async function toggleCurtirCom(id) {
    if (!user) { abrirModal(); return }
    const jaCurti = curtiCom[id]
    setCurtiCom(function(p){ return Object.assign({}, p, { [id]: !jaCurti }) })
    setCurtidasCom(function(p){ return Object.assign({}, p, { [id]: (p[id]||0) + (jaCurti ? -1 : 1) }) })
    if (jaCurti) await supabase.from('curtidas_comentarios').delete().eq('comentario_id', id).eq('user_id', user.id)
    else await supabase.from('curtidas_comentarios').insert({ comentario_id: id, user_id: user.id })
  }

  async function enviar(parentId) {
    if (!user) { abrirModal(); return }
    const conteudo = parentId ? textoResp : texto
    if (!conteudo.trim()) return
    await supabase.from('comentarios').insert({ post_id: postId, user_id: user.id, parent_id: parentId || null, texto: conteudo.trim() })
    if (parentId) { setTextoResp(''); setRespondendo(null) } else setTexto('')
    carregar()
  }

  async function apagar(id) {
    if (!confirm('Apagar este comentário?')) return
    await supabase.from('comentarios').delete().eq('id', id)
    carregar()
  }

  function nomeDe(uid) {
    const p = perfis[uid]
    return p && p.nome ? p.nome : 'Usuário'
  }

  function Comentario({ c, nivel }) {
    const respostas = comentarios.filter(function(x){ return x.parent_id === c.id })
    return (
      <div style={{ marginLeft: nivel > 0 ? '20px' : 0, marginTop: '16px', paddingLeft: nivel > 0 ? '16px' : 0, borderLeft: nivel > 0 ? '2px solid #f3f4f6' : 'none' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#374151', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>
            {nomeDe(c.user_id)[0].toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: '700', color: '#111' }}>{nomeDe(c.user_id)}</span>
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>{tempoAtras(c.criado_em)}</span>
            </div>
            <p style={{ fontSize: '14px', color: '#111', lineHeight: '1.5', margin: '4px 0 6px' }}>{c.texto}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Coracao ativo={!!curtiCom[c.id]} n={curtidasCom[c.id] || 0} onClick={function(){ toggleCurtirCom(c.id) }} />
              <button onClick={function(){ setRespondendo(respondendo === c.id ? null : c.id); setTextoResp('') }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '13px', fontWeight: '600' }}>Responder</button>
              {(user && (user.id === c.user_id || user.id === ADMIN_ID)) && (
                <button onClick={function(){ apagar(c.id) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '13px' }}>Apagar</button>
              )}
            </div>
            {respondendo === c.id && (
              <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
                <input value={textoResp} onChange={function(e){ setTextoResp(e.target.value) }} placeholder='Escreva uma resposta...'
                  onKeyDown={function(e){ if (e.key === 'Enter') enviar(c.id) }}
                  style={{ flex: 1, padding: '8px 12px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '13px', outline: 'none', color: '#111' }} />
                <button onClick={function(){ enviar(c.id) }} className={lexend.className} style={{ padding: '8px 16px', background: '#000', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '13px', cursor: 'pointer' }}>Enviar</button>
              </div>
            )}
            {respostas.map(function(r){ return <Comentario key={r.id} c={r} nivel={nivel+1} /> })}
          </div>
        </div>
      </div>
    )
  }

  const raiz = comentarios.filter(function(c){ return !c.parent_id })

  return (
    <div style={{ marginTop: '40px', paddingTop: '32px', borderTop: '1px solid #f3f4f6' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
        <Coracao ativo={curtiPost} n={curtidasPost} onClick={toggleCurtirPost} />
        <span style={{ fontSize: '13px', color: '#9ca3af' }}>{raiz.length} comentário{raiz.length !== 1 ? 's' : ''}</span>
      </div>

      <h3 className={lexend.className} style={{ fontSize: '20px', color: '#111', letterSpacing: '-0.04em', marginBottom: '16px' }}>Comentários</h3>

      {user ? (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <input value={texto} onChange={function(e){ setTexto(e.target.value) }} placeholder='Escreva um comentário...'
            onKeyDown={function(e){ if (e.key === 'Enter') enviar(null) }}
            style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '14px', outline: 'none', color: '#111' }} />
          <button onClick={function(){ enviar(null) }} className={lexend.className} style={{ padding: '10px 18px', background: '#000', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', cursor: 'pointer' }}>Comentar</button>
        </div>
      ) : (
        <button onClick={abrirModal} style={{ padding: '10px 18px', background: '#f3f4f6', color: '#111', border: 'none', borderRadius: '10px', fontSize: '14px', cursor: 'pointer' }}>Entre para comentar</button>
      )}

      <div>
        {raiz.map(function(c){ return <Comentario key={c.id} c={c} nivel={0} /> })}
      </div>
    </div>
  )
}
