'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from './AuthContext'
import { Lexend } from 'next/font/google'

const lexend = Lexend({ subsets: ['latin'], weight: '700' })
const ADMIN_ID = 'b20f6b3d-9e42-4445-a4a5-6509aee5bcb5'

const LABELS = { 1: 'Furada', 2: 'Quebra um galho', 3: 'Vale a remada', 4: 'Pico bom', 5: 'Pico raiz' }

const GRUPOS_TAGS = []

function tempoAtras(data) {
  const seg = Math.floor((Date.now() - new Date(data)) / 1000)
  if (seg < 60) return 'agora'
  if (seg < 3600) return Math.floor(seg / 60) + 'min'
  if (seg < 86400) return Math.floor(seg / 3600) + 'h'
  if (seg < 604800) return Math.floor(seg / 86400) + 'd'
  return new Date(data).toLocaleDateString('pt-BR')
}

function Estrelas({ valor, onChange, tamanho = 22 }) {
  const [hover, setHover] = useState(0)
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map(function (n) {
        const ativo = (hover || valor) >= n
        return (
          <button key={n} type='button'
            onClick={onChange ? function () { onChange(n) } : undefined}
            onMouseEnter={onChange ? function () { setHover(n) } : undefined}
            onMouseLeave={onChange ? function () { setHover(0) } : undefined}
            style={{ background: 'none', border: 'none', padding: 0, cursor: onChange ? 'pointer' : 'default', lineHeight: 0 }}
            aria-label={n + ' estrelas'}>
            <svg width={tamanho} height={tamanho} viewBox='0 0 24 24' fill={ativo ? '#000' : 'none'} stroke={ativo ? '#000' : '#d1d5db'} strokeWidth='2'>
              <polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' />
            </svg>
          </button>
        )
      })}
    </div>
  )
}

function Coracao({ ativo, n, onClick }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', color: ativo ? '#ef4444' : '#9ca3af', fontSize: '13px' }}>
      <svg width='16' height='16' viewBox='0 0 24 24' fill={ativo ? '#ef4444' : 'none'} stroke={ativo ? '#ef4444' : '#9ca3af'} strokeWidth='2'><path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' /></svg>
      {n > 0 && <span>{n}</span>}
    </button>
  )
}

export default function AvaliacoesPraia({ nome, slug }) {
  const { user, perfil, abrirModal } = useAuth()
  const [avaliacoes, setAvaliacoes] = useState([])
  const [perfis, setPerfis] = useState({})
  const [respostas, setRespostas] = useState({})
  const [curtidas, setCurtidas] = useState({})
  const [curti, setCurti] = useState({})
  const [minhaAval, setMinhaAval] = useState(null)
  const [editando, setEditando] = useState(false)
  const [nota, setNota] = useState(0)
  const [tags, setTags] = useState([])
  const [texto, setTexto] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [respondendo, setRespondendo] = useState(null)
  const [textoResp, setTextoResp] = useState('')

  useEffect(function () { carregar() }, [slug, user])

  async function carregar() {
    const { data: avs } = await supabase.from('avaliacoes').select('*').eq('praia_slug', slug).order('criado_em', { ascending: false })
    setAvaliacoes(avs || [])

    const minha = (avs || []).find(function (a) { return user && a.user_id === user.id })
    setMinhaAval(minha || null)

    const ids = Array.from(new Set((avs || []).map(function (a) { return a.user_id })))
    if (ids.length > 0) {
      const { data: ps } = await supabase.from('profiles').select('id, nome, avatar_url').in('id', ids)
      const mapa = {}
      ;(ps || []).forEach(function (p) { mapa[p.id] = p })
      setPerfis(mapa)
    }

    const avIds = (avs || []).map(function (a) { return a.id })
    if (avIds.length > 0) {
      const { data: resp } = await supabase.from('respostas_avaliacoes').select('*').in('avaliacao_id', avIds).order('criado_em', { ascending: true })
      const mr = {}
      ;(resp || []).forEach(function (r) { (mr[r.avaliacao_id] = mr[r.avaliacao_id] || []).push(r) })
      setRespostas(mr)
      const idsResp = Array.from(new Set((resp || []).map(function (r) { return r.user_id })))
      if (idsResp.length > 0) {
        const { data: ps2 } = await supabase.from('profiles').select('id, nome, avatar_url').in('id', idsResp)
        setPerfis(function (prev) { const m = { ...prev }; (ps2 || []).forEach(function (p) { m[p.id] = p }); return m })
      }

      const { data: cur } = await supabase.from('curtidas_avaliacoes').select('avaliacao_id, user_id').in('avaliacao_id', avIds)
      const cont = {}, meu = {}
      ;(cur || []).forEach(function (x) {
        cont[x.avaliacao_id] = (cont[x.avaliacao_id] || 0) + 1
        if (user && x.user_id === user.id) meu[x.avaliacao_id] = true
      })
      setCurtidas(cont)
      setCurti(meu)
    }
  }

  function abrirEdicao() {
    if (!user) { abrirModal(); return }
    if (minhaAval) {
      setNota(minhaAval.nota); setTags(minhaAval.tags || []); setTexto(minhaAval.texto || '')
    } else {
      setNota(0); setTags([]); setTexto('')
    }
    setEditando(true)
  }

  function toggleTag(t) {
    setTags(function (prev) { return prev.includes(t) ? prev.filter(function (x) { return x !== t }) : [...prev, t] })
  }

  async function salvar() {
    if (nota === 0) { alert('Dá uma nota de 1 a 5 estrelas.'); return }
    setSalvando(true)
    const payload = { praia_slug: slug, user_id: user.id, nota: nota, tags: tags, texto: texto.trim() || null }
    if (minhaAval) {
      await supabase.from('avaliacoes').update(payload).eq('id', minhaAval.id)
    } else {
      await supabase.from('avaliacoes').insert(payload)
    }
    setSalvando(false); setEditando(false)
    await carregar()
  }

  async function apagar(id) {
    if (!confirm('Apagar sua avaliação?')) return
    await supabase.from('avaliacoes').delete().eq('id', id)
    setMinhaAval(null); await carregar()
  }

  async function curtir(avId) {
    if (!user) { abrirModal(); return }
    if (curti[avId]) {
      await supabase.from('curtidas_avaliacoes').delete().eq('avaliacao_id', avId).eq('user_id', user.id)
    } else {
      await supabase.from('curtidas_avaliacoes').insert({ avaliacao_id: avId, user_id: user.id })
    }
    await carregar()
  }

  async function responder(avId) {
    if (!user) { abrirModal(); return }
    if (!textoResp.trim()) return
    await supabase.from('respostas_avaliacoes').insert({ avaliacao_id: avId, user_id: user.id, texto: textoResp.trim() })
    setTextoResp(''); setRespondendo(null); await carregar()
  }

  async function apagarResp(id) {
    if (!confirm('Apagar resposta?')) return
    await supabase.from('respostas_avaliacoes').delete().eq('id', id)
    await carregar()
  }

  const total = avaliacoes.length
  const media = total > 0 ? (avaliacoes.reduce(function (s, a) { return s + a.nota }, 0) / total) : 0
  const contagemTags = {}
  avaliacoes.forEach(function (a) { (a.tags || []).forEach(function (t) { contagemTags[t] = (contagemTags[t] || 0) + 1 }) })
  const topTags = Object.keys(contagemTags).sort(function (x, y) { return contagemTags[y] - contagemTags[x] }).slice(0, 4)

  return (
    <div style={{ maxWidth: '720px' }}>
      {/* RESUMO */}
      <div style={{ marginBottom: '28px' }}>
        {total > 0 ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
              <span className={lexend.className} style={{ fontSize: '40px', fontWeight: '700', letterSpacing: '-0.06em', color: '#111' }}>{media.toFixed(1)}</span>
              <Estrelas valor={Math.round(media)} tamanho={18} />
              <span style={{ color: '#4b5563', fontSize: '14px' }}>{total} {total === 1 ? 'avaliação' : 'avaliações'}</span>
            </div>
            {topTags.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '14px' }}>
                {topTags.map(function (t) {
                  return <span key={t} style={{ background: '#f3f4f6', color: '#374151', fontSize: '12px', padding: '5px 11px', borderRadius: '999px' }}>{t} · {contagemTags[t]}</span>
                })}
              </div>
            )}
          </div>
        ) : (
          <p style={{ color: '#4b5563', fontSize: '14px' }}>Ninguém avaliou a {nome} ainda. Seja o primeiro a contar como é surfar aqui.</p>
        )}
      </div>

      {/* BOTÃO AVALIAR / EDITAR */}
      {!editando && (
        <button onClick={abrirEdicao} style={{ background: 'black', color: 'white', border: 'none', borderRadius: '999px', padding: '11px 22px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', marginBottom: '28px' }}>
          {minhaAval ? 'Editar minha avaliação' : 'Avaliar essa praia'}
        </button>
      )}

      {/* FORMULÁRIO */}
      {editando && (
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '14px', padding: '20px', marginBottom: '28px' }}>
          <p className={lexend.className} style={{ fontSize: '17px', fontWeight: '700', letterSpacing: '-0.04em', marginBottom: '4px', color: '#111' }}>Como é surfar na {nome}?</p>
          <p style={{ color: '#4b5563', fontSize: '13px', marginBottom: '18px' }}>Pensa no pico no geral — não num dia específico.</p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
            <Estrelas valor={nota} onChange={setNota} tamanho={30} />
            {nota > 0 && <span style={{ fontSize: '14px', fontWeight: '600' }}>{LABELS[nota]}</span>}
          </div>

          {GRUPOS_TAGS.map(function (g) {
            return (
              <div key={g.titulo} style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', fontWeight: '600' }}>{g.titulo}</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {g.tags.map(function (t) {
                    const on = tags.includes(t)
                    return (
                      <button key={t} type='button' onClick={function () { toggleTag(t) }}
                        style={{ background: on ? 'black' : 'white', color: on ? 'white' : '#374151', border: '1px solid ' + (on ? 'black' : '#d1d5db'), borderRadius: '999px', padding: '6px 13px', fontSize: '13px', cursor: 'pointer' }}>{t}</button>
                    )
                  })}
                </div>
              </div>
            )
          })}

          <textarea value={texto} onChange={function (e) { setTexto(e.target.value) }}
            placeholder='Como é o pico no geral? Pra quem você indica, o que esperar do fundo, da remada, da vibe...'
            rows={4}
            style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '10px', padding: '12px', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical', marginTop: '8px', marginBottom: '16px', boxSizing: 'border-box', color: '#111' }} />

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={salvar} disabled={salvando} style={{ background: 'black', color: 'white', border: 'none', borderRadius: '999px', padding: '10px 22px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', opacity: salvando ? 0.6 : 1 }}>{salvando ? 'Salvando...' : 'Publicar'}</button>
            <button onClick={function () { setEditando(false) }} style={{ background: 'white', color: '#374151', border: '1px solid #d1d5db', borderRadius: '999px', padding: '10px 22px', fontSize: '14px', cursor: 'pointer' }}>Cancelar</button>
            {minhaAval && <button onClick={function () { apagar(minhaAval.id) }} style={{ background: 'none', color: '#ef4444', border: 'none', fontSize: '13px', cursor: 'pointer', marginLeft: 'auto' }}>Apagar</button>}
          </div>
        </div>
      )}

      {/* LISTA */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {avaliacoes.map(function (a) {
          const p = perfis[a.user_id] || {}
          const ehDono = user && a.user_id === user.id
          const resps = respostas[a.id] || []
          return (
            <div key={a.id} style={{ borderTop: '1px solid #f0f0f0', paddingTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                {p.avatar_url
                  ? <img src={p.avatar_url} alt='' style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }} />
                  : <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: '#6b7280', fontWeight: '600' }}>{(p.nome || '?').charAt(0).toUpperCase()}</div>}
                <div>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#111' }}>{p.nome || 'Surfista'}{ehDono && <span style={{ color: '#6b7280', fontWeight: '400' }}> · você</span>}</p>
                  <p style={{ fontSize: '12px', color: '#6b7280' }}>{tempoAtras(a.criado_em)}</p>
                </div>
                <div style={{ marginLeft: 'auto' }}><Estrelas valor={a.nota} tamanho={15} /></div>
              </div>

              {(a.tags || []).length > 0 && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  {a.tags.map(function (t) { return <span key={t} style={{ background: '#f3f4f6', color: '#374151', fontSize: '11px', padding: '3px 9px', borderRadius: '999px' }}>{t}</span> })}
                </div>
              )}

              {a.texto && <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#1f2937', marginBottom: '8px' }}>{a.texto}</p>}

              <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                <Coracao ativo={curti[a.id]} n={curtidas[a.id] || 0} onClick={function () { curtir(a.id) }} />
                <button onClick={function () { setRespondendo(respondendo === a.id ? null : a.id) }} style={{ background: 'none', border: 'none', color: '#4b5563', fontSize: '13px', cursor: 'pointer', padding: '4px 0' }}>Responder</button>
                {(ehDono || (user && user.id === ADMIN_ID)) && ehDono && <button onClick={function () { abrirEdicao() }} style={{ background: 'none', border: 'none', color: '#4b5563', fontSize: '13px', cursor: 'pointer', padding: '4px 0' }}>Editar</button>}
              </div>

              {respondendo === a.id && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <input value={textoResp} onChange={function (e) { setTextoResp(e.target.value) }} placeholder='Escreva uma resposta...'
                    style={{ flex: 1, border: '1px solid #d1d5db', borderRadius: '999px', padding: '8px 14px', fontSize: '13px', fontFamily: 'inherit', color: '#111' }} />
                  <button onClick={function () { responder(a.id) }} style={{ background: 'black', color: 'white', border: 'none', borderRadius: '999px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer' }}>Enviar</button>
                </div>
              )}

              {resps.length > 0 && (
                <div style={{ marginTop: '12px', paddingLeft: '16px', borderLeft: '2px solid #f0f0f0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {resps.map(function (r) {
                    const pr = perfis[r.user_id] || {}
                    const podeApagar = (user && r.user_id === user.id) || (user && user.id === ADMIN_ID)
                    return (
                      <div key={r.id}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '13px', fontWeight: '600', color: '#111' }}>{pr.nome || 'Surfista'}</span>
                          <span style={{ fontSize: '11px', color: '#6b7280' }}>{tempoAtras(r.criado_em)}</span>
                          {podeApagar && <button onClick={function () { apagarResp(r.id) }} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '11px', cursor: 'pointer', marginLeft: 'auto' }}>apagar</button>}
                        </div>
                        <p style={{ fontSize: '13px', color: '#1f2937', marginTop: '2px' }}>{r.texto}</p>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
