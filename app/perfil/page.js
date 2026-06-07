'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../components/AuthContext'
import { Lexend } from 'next/font/google'

const lexend = Lexend({ subsets: ['latin'], weight: '700' })

const TEMPOS = ['< 1 ano', '1-3 anos', '3-5 anos', '5-10 anos', '10-20 anos', '20+ anos']
const NIVEIS = ['Iniciante', 'Intermediário', 'Avançado', 'Pro']
const POSICOES = ['Regular', 'Goofy']
const PICOS = ['Silveira Sul', 'Silveira Norte', 'Ferrugem Norte', 'Ferrugem Sul', 'Barra', 'Siriú Norte', 'Siriú - Meio de Praia', 'Gamboa', 'Ouvidor', 'Praia Central']
const PAISES = [
  { nome: 'Brasil', code: '+55', flag: '🇧🇷' },
  { nome: 'Portugal', code: '+351', flag: '🇵🇹' },
  { nome: 'Argentina', code: '+54', flag: '🇦🇷' },
  { nome: 'Uruguai', code: '+598', flag: '🇺🇾' },
  { nome: 'Chile', code: '+56', flag: '🇨🇱' },
  { nome: 'Estados Unidos', code: '+1', flag: '🇺🇸' },
  { nome: 'Espanha', code: '+34', flag: '🇪🇸' },
  { nome: 'França', code: '+33', flag: '🇫🇷' },
  { nome: 'Austrália', code: '+61', flag: '🇦🇺' },
  { nome: 'Reino Unido', code: '+44', flag: '🇬🇧' },
]

// separa o whatsapp salvo (ex '+55 48 99999-9999') em codigo + resto
function separarWhats(valor) {
  if (!valor) return { code: '+55', numero: '' }
  const achado = PAISES.slice().sort(function(a,b){ return b.code.length - a.code.length })
    .find(function(p){ return valor.indexOf(p.code) === 0 })
  if (achado) return { code: achado.code, numero: valor.slice(achado.code.length).trim() }
  return { code: '+55', numero: valor }
}

const card = { background: '#fff', borderRadius: '14px', border: '1px solid #eceef1', padding: '24px', marginBottom: '20px' }
const label = { fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '10px', fontWeight: '700' }
const input = { width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #eceef1', fontSize: '15px', outline: 'none', boxSizing: 'border-box', background: 'white', color: '#111' }

function Chip({ ativo, onClick, children }) {
  return (
    <button onClick={onClick} className={lexend.className} style={{
      padding: '10px 18px', borderRadius: '10px', border: ativo ? '1px solid black' : '1px solid #eceef1', cursor: 'pointer', fontSize: '14px',
      background: ativo ? 'black' : '#fff', color: ativo ? 'white' : '#6b7280', transition: 'all 0.12s'
    }}>{children}</button>
  )
}

function LinhaInfo({ rotulo, valor }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #f3f4f6' }}>
      <span style={{ fontSize: '13px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{rotulo}</span>
      <span className={lexend.className} style={{ fontSize: '15px', color: valor ? '#111' : '#d1d5db' }}>{valor || 'Não informado'}</span>
    </div>
  )
}

export default function Perfil() {
  const { user, perfil, loading, abrirModal } = useAuth()
  const [f, setF] = useState(null)
  const [editando, setEditando] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(function() {
    if (loading || !user) return
    const base = {
      nome: (perfil && perfil.nome) || '',
      tipo_usuario: (perfil && perfil.tipo_usuario) || 'surfista',
      cidade: (perfil && perfil.cidade) || '',
      foto_url: (perfil && perfil.foto_url) || '',
      tempo_surf: (perfil && perfil.tempo_surf) || '',
      nivel_surf: (perfil && perfil.nivel_surf) || '',
      posicao: (perfil && perfil.posicao) || '',
      pico_favorito: (perfil && perfil.pico_favorito) || '',
      whatsapp_code: separarWhats((perfil && perfil.whatsapp) || '').code,
      whatsapp_num: separarWhats((perfil && perfil.whatsapp) || '').numero,
      instagram: ((perfil && perfil.instagram) || '').replace('@', ''),
    }
    setF(base)
  }, [user, perfil, loading])

  function set(c, v) { setF(function(p){ return Object.assign({}, p, { [c]: v }) }) }

  async function salvar() {
    if (!f.nome.trim()) { setMsg('Coloque seu nome ou apelido.'); return }
    setSalvando(true)
    setMsg('')
    const ehSurf = f.tipo_usuario === 'surfista'
    const dados = {
      nome: f.nome, tipo_usuario: f.tipo_usuario, cidade: f.cidade, foto_url: f.foto_url, whatsapp: f.whatsapp_num.trim() ? (f.whatsapp_code + ' ' + f.whatsapp_num.trim()) : '', instagram: f.instagram.trim() ? f.instagram.trim().replace('@', '') : '',
      tempo_surf: ehSurf ? f.tempo_surf : null,
      nivel_surf: ehSurf ? f.nivel_surf : null,
      posicao: ehSurf ? f.posicao : null,
      pico_favorito: ehSurf ? f.pico_favorito : null,
    }
    const { error } = await supabase.from('profiles').update(dados).eq('id', user.id)
    setSalvando(false)
    if (error) { setMsg('Erro ao salvar: ' + error.message); return }
    setEditando(false)
  }

  if (loading) return <div className='min-h-screen bg-white'><Navbar /><div style={{ padding: '120px 16px', textAlign: 'center', color: '#9ca3af' }}>Carregando...</div><Footer /></div>

  if (!user) return (
    <div className='min-h-screen bg-white'><Navbar />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '120px 16px', textAlign: 'center' }}>
        <h1 className={lexend.className} style={{ fontSize: '24px', color: '#111', letterSpacing: '-0.05em', marginBottom: '12px' }}>Entre para ver seu perfil</h1>
        <p style={{ color: '#6b7280', marginBottom: '16px' }}>Faça login para editar suas informações.</p>
        <button onClick={abrirModal} className={lexend.className} style={{ padding: '12px 24px', background: 'black', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', cursor: 'pointer' }}>Entrar</button>
      </div>
      <Footer />
    </div>
  )

  if (!f) return null
  const ehSurfista = f.tipo_usuario === 'surfista'
  const inicial = (f.nome || 'U').trim().charAt(0).toUpperCase()

  // ===== CABECALHO (comum aos dois modos) =====
  const cabecalho = (
    <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #eceef1', padding: '24px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '18px' }}>
      {f.foto_url
        ? <img src={f.foto_url} alt='' style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #eceef1', flexShrink: 0 }} />
        : <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '26px', flexShrink: 0 }} className={lexend.className}>{inicial}</div>}
      <div style={{ minWidth: 0 }}>
        <div className={lexend.className} style={{ color: '#111', fontSize: '20px', letterSpacing: '-0.04em' }}>{f.nome || 'Seu nome'}</div>
        <div style={{ color: '#9ca3af', fontSize: '13px', marginTop: '2px', wordBreak: 'break-all' }}>{user.email}</div>
        <span style={{ display: 'inline-block', marginTop: '8px', fontSize: '12px', color: '#6b7280', background: '#f3f4f6', padding: '3px 12px', borderRadius: '20px' }}>{ehSurfista ? 'Surfista' : 'Não surfista'}</span>
      </div>
    </div>
  )

  return (
    <div className='min-h-screen bg-white'>
      <Navbar />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '90px 16px 70px' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px', gap: '12px' }}>
          <div>
            <h1 className={lexend.className} style={{ fontSize: '30px', color: '#111', letterSpacing: '-0.06em', marginBottom: '6px' }}>Meu perfil</h1>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>Suas informações no GaropabaSurf.</p>
          </div>
          {!editando && (
            <button onClick={function(){ setEditando(true); setMsg('') }} className={lexend.className} style={{ padding: '10px 20px', background: 'black', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap' }}>Editar</button>
          )}
        </div>

        {cabecalho}

        {msg && <div style={{ background: msg.indexOf('Erro') >= 0 ? '#fef2f2' : '#f3f4f6', color: msg.indexOf('Erro') >= 0 ? '#dc2626' : '#111', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '14px' }}>{msg}</div>}

        {!editando ? (
          /* ===================== MODO VISUALIZACAO ===================== */
          <div>
            <div style={card}>
              <div className={lexend.className} style={{ fontSize: '16px', color: '#111', marginBottom: '6px' }}>Dados</div>
              <LinhaInfo rotulo='Cidade' valor={f.cidade} />
              {ehSurfista && <LinhaInfo rotulo='Experiência' valor={f.tempo_surf} />}
              {ehSurfista && <LinhaInfo rotulo='Nível' valor={f.nivel_surf} />}
              {ehSurfista && <LinhaInfo rotulo='Posição' valor={f.posicao} />}
              {ehSurfista && <LinhaInfo rotulo='Pico favorito' valor={f.pico_favorito} />}
            </div>

            <div style={card}>
              <div className={lexend.className} style={{ fontSize: '16px', color: '#111', marginBottom: '6px' }}>Contato</div>
              <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '6px' }}>Visível apenas para você.</p>
              <LinhaInfo rotulo='E-mail' valor={user.email} />
              <LinhaInfo rotulo='WhatsApp' valor={f.whatsapp_num ? (f.whatsapp_code + ' ' + f.whatsapp_num) : ''} />
              <LinhaInfo rotulo='Instagram' valor={f.instagram ? ('@' + f.instagram) : ''} />
            </div>
          </div>
        ) : (
          /* ===================== MODO EDICAO ===================== */
          <div>
            <div style={card}>
              <label style={label}>Você é surfista?</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Chip ativo={ehSurfista} onClick={function(){ set('tipo_usuario', 'surfista') }}>Surfista</Chip>
                <Chip ativo={!ehSurfista} onClick={function(){ set('tipo_usuario', 'nao_surfista') }}>Não surfista</Chip>
              </div>
            </div>

            <div style={card}>
              <label style={label}>Nome ou apelido</label>
              <input value={f.nome} onChange={function(e){ set('nome', e.target.value) }} placeholder='Como quer ser chamado' style={Object.assign({}, input, { marginBottom: '18px' })} />
              <label style={label}>Cidade</label>
              <input value={f.cidade} onChange={function(e){ set('cidade', e.target.value) }} placeholder='Ex: Garopaba, SC' style={Object.assign({}, input, { marginBottom: '18px' })} />
              <label style={label}>Foto (link da imagem)</label>
              <input value={f.foto_url} onChange={function(e){ set('foto_url', e.target.value) }} placeholder='https://...' style={input} />
            </div>

            {ehSurfista && (
              <div style={card}>
                <label style={label}>Há quanto tempo surfa?</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                  {TEMPOS.map(function(t){ return <Chip key={t} ativo={f.tempo_surf === t} onClick={function(){ set('tempo_surf', t) }}>{t}</Chip> })}
                </div>
                <label style={label}>Nível de surf</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                  {NIVEIS.map(function(n){ return <Chip key={n} ativo={f.nivel_surf === n} onClick={function(){ set('nivel_surf', n) }}>{n}</Chip> })}
                </div>
                <label style={label}>Posição</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                  {POSICOES.map(function(p){ return <Chip key={p} ativo={f.posicao === p} onClick={function(){ set('posicao', p) }}>{p}</Chip> })}
                </div>
                <label style={label}>Pico favorito em Garopaba</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {PICOS.map(function(pk){ return <Chip key={pk} ativo={f.pico_favorito === pk} onClick={function(){ set('pico_favorito', pk) }}>{pk}</Chip> })}
                </div>
              </div>
            )}

            <div style={card}>
              <label style={label}>WhatsApp (visível só para você)</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select value={f.whatsapp_code} onChange={function(e){ set('whatsapp_code', e.target.value) }} style={Object.assign({}, input, { width: 'auto', flexShrink: 0, cursor: 'pointer' })}>
                  {PAISES.map(function(pa){ return <option key={pa.code} value={pa.code}>{pa.flag} {pa.code}</option> })}
                </select>
                <input value={f.whatsapp_num} onChange={function(e){ set('whatsapp_num', e.target.value) }} placeholder='48 99999-9999' style={Object.assign({}, input, { flex: 1 })} />
              </div>

              <label style={Object.assign({}, label, { marginTop: '18px' })}>Instagram (visível só para você)</label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #eceef1', borderRadius: '10px', overflow: 'hidden', background: 'white' }}>
                <span style={{ padding: '12px 4px 12px 14px', color: '#9ca3af', fontSize: '15px' }}>@</span>
                <input value={f.instagram} onChange={function(e){ set('instagram', e.target.value.replace('@', '')) }} placeholder='seu_usuario' style={{ flex: 1, padding: '12px 14px 12px 2px', border: 'none', outline: 'none', fontSize: '15px', background: 'transparent', color: '#111' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={salvar} disabled={salvando} className={lexend.className} style={{ flex: 1, padding: '15px', background: 'black', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', cursor: salvando ? 'default' : 'pointer', opacity: salvando ? 0.6 : 1 }}>
                {salvando ? 'Salvando...' : 'Salvar perfil'}
              </button>
              {f.nome && (
                <button onClick={function(){ setEditando(false); setMsg('') }} className={lexend.className} style={{ padding: '15px 24px', background: '#fff', color: '#6b7280', border: '1px solid #eceef1', borderRadius: '12px', fontSize: '16px', cursor: 'pointer' }}>Cancelar</button>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
