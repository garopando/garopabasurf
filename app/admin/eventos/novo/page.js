'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../../lib/supabase'
import { Lexend } from 'next/font/google'
import { useAuth } from '../../../components/AuthContext'

const lexend = Lexend({ subsets: ['latin'], weight: '700' })
const ADMIN_ID = 'b20f6b3d-9e42-4445-a4a5-6509aee5bcb5'

const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: 'white', color: '#111' }
const labelStyle = { fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '6px' }

export default function NovoEvento() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [f, setF] = useState({ titulo: '', descricao: '', local: '', data_inicio: '', data_fim: '', hora: '', tipo: 'Campeonato', thumbnail: '', link: '', publicado: false })
  const [salvando, setSalvando] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(function() {
    if (authLoading) return
    if (!user || user.id !== ADMIN_ID) router.replace('/admin')
  }, [user, authLoading])

  function set(campo, valor) { setF(function(p) { return Object.assign({}, p, { [campo]: valor }) }) }

  async function salvar() {
    if (!f.titulo || !f.data_inicio) { setMsg('Preencha ao menos o título e a data de início.'); return }
    setSalvando(true)
    const { error } = await supabase.from('eventos').insert({
      titulo: f.titulo, descricao: f.descricao, local: f.local,
      data_inicio: f.data_inicio, data_fim: f.data_fim || null, hora: f.hora,
      tipo: f.tipo, thumbnail: f.thumbnail, link: f.link, publicado: f.publicado,
    })
    setSalvando(false)
    if (error) setMsg('Erro ao salvar: ' + error.message)
    else router.push('/admin/eventos')
  }

  return <FormEvento f={f} set={set} salvar={salvar} salvando={salvando} msg={msg} router={router} titulo='Novo Evento' />
}

function FormEvento({ f, set, salvar, salvando, msg, router, titulo }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <div style={{ background: 'black', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 className={lexend.className} style={{ color: 'white', fontSize: '20px', letterSpacing: '-0.06em' }}>{titulo}</h1>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', fontSize: '13px', cursor: 'pointer' }}>
            <input type='checkbox' checked={f.publicado} onChange={function(e) { set('publicado', e.target.checked) }} />
            Publicar
          </label>
          <button onClick={function() { router.push('/admin/eventos') }}
            style={{ background: 'transparent', color: '#9ca3af', border: '1px solid #374151', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer' }}>Cancelar</button>
          <button onClick={salvar} disabled={salvando}
            style={{ background: 'white', color: 'black', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', fontWeight: '700' }}>
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '32px 16px' }}>
        {msg && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '12px', marginBottom: '16px', fontSize: '14px' }}>{msg}</div>}

        <label style={labelStyle}>Título do evento *</label>
        <input value={f.titulo} onChange={function(e) { set('titulo', e.target.value) }} placeholder='Ex: Circuito Catarinense de Surf - Etapa Garopaba' style={Object.assign({}, inputStyle, { marginBottom: '16px' })} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={labelStyle}>Tipo</label>
            <select value={f.tipo} onChange={function(e) { set('tipo', e.target.value) }} style={inputStyle}>
              <option>Campeonato</option>
              <option>Evento local</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Local</label>
            <input value={f.local} onChange={function(e) { set('local', e.target.value) }} placeholder='Ex: Praia do Silveira' style={inputStyle} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={labelStyle}>Data de início *</label>
            <input type='date' value={f.data_inicio} onChange={function(e) { set('data_inicio', e.target.value) }} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Data de fim (opcional)</label>
            <input type='date' value={f.data_fim} onChange={function(e) { set('data_fim', e.target.value) }} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Horário</label>
            <input value={f.hora} onChange={function(e) { set('hora', e.target.value) }} placeholder='Ex: 08h' style={inputStyle} />
          </div>
        </div>

        <label style={labelStyle}>URL da imagem (thumbnail)</label>
        <input value={f.thumbnail} onChange={function(e) { set('thumbnail', e.target.value) }} placeholder='https://...' style={Object.assign({}, inputStyle, { marginBottom: '16px' })} />

        <label style={labelStyle}>Link (inscrição / mais info)</label>
        <input value={f.link} onChange={function(e) { set('link', e.target.value) }} placeholder='https://...' style={Object.assign({}, inputStyle, { marginBottom: '16px' })} />

        <label style={labelStyle}>Descrição</label>
        <textarea value={f.descricao} onChange={function(e) { set('descricao', e.target.value) }} placeholder='Detalhes do evento...' style={Object.assign({}, inputStyle, { minHeight: '120px', resize: 'vertical' })} />
      </div>
    </div>
  )
}

export { FormEvento, inputStyle, labelStyle }
