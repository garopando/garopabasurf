'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import { Lexend } from 'next/font/google'
import { useAuth } from '../../components/AuthContext'

const lexend = Lexend({ subsets: ['latin'], weight: '700' })
const ADMIN_ID = 'b20f6b3d-9e42-4445-a4a5-6509aee5bcb5'

export default function AdminEventos() {
  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { user, loading: authLoading, sair: sairAuth } = useAuth()

  useEffect(function() {
    if (authLoading) return
    if (!user || user.id !== ADMIN_ID) { router.replace('/admin'); return }
    carregar()
  }, [user, authLoading])

  async function carregar() {
    const { data } = await supabase.from('eventos').select('*').order('data_inicio', { ascending: true })
    setEventos(data || [])
    setLoading(false)
  }

  async function excluir(id) {
    if (!confirm('Excluir este evento?')) return
    await supabase.from('eventos').delete().eq('id', id)
    carregar()
  }

  async function togglePublicado(id, pub) {
    await supabase.from('eventos').update({ publicado: !pub }).eq('id', id)
    carregar()
  }

  async function sair() { await sairAuth(); router.push('/') }

  function fmt(d) {
    if (!d) return ''
    return new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <div style={{ background: 'black', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 className={lexend.className} style={{ color: 'white', fontSize: '20px', letterSpacing: '-0.06em' }}>garopabasurf eventos</h1>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <a href='/admin' style={{ color: '#9ca3af', fontSize: '13px', textDecoration: 'none' }}>Painel</a>
          <a href='/admin/posts' style={{ color: '#9ca3af', fontSize: '13px', textDecoration: 'none' }}>Blog</a>
          <a href='/admin/eventos' style={{ color: 'white', fontSize: '13px', textDecoration: 'none', fontWeight: '700' }}>Eventos</a>
          <a href='/admin/videos' style={{ color: '#9ca3af', fontSize: '13px', textDecoration: 'none' }}>TV</a>
          <a href='/admin/radar' style={{ color: '#9ca3af', fontSize: '13px', textDecoration: 'none' }}>Radar</a>
          <a href='/' target='_blank' rel='noreferrer' style={{ color: '#9ca3af', fontSize: '13px', textDecoration: 'none' }}>Ver site ↗</a>
          <button onClick={function() { router.push('/admin/eventos/novo') }}
            style={{ background: 'white', color: 'black', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', fontWeight: '700' }}>
            + Novo Evento
          </button>
          <button onClick={sair} style={{ background: 'transparent', color: '#9ca3af', border: '1px solid #374151', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer' }}>Sair</button>
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 16px' }}>
        <h2 className={lexend.className} style={{ fontSize: '24px', color: 'black', letterSpacing: '-0.06em', marginBottom: '24px' }}>Eventos</h2>
        {loading && <p style={{ color: '#9ca3af' }}>Carregando...</p>}
        {!loading && eventos.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
            <p>Nenhum evento ainda.</p>
            <button onClick={function() { router.push('/admin/eventos/novo') }}
              style={{ marginTop: '16px', background: 'black', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer', fontWeight: '700' }}>
              Criar primeiro evento
            </button>
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {eventos.map(function(ev) {
            return (
              <div key={ev.id} style={{ background: 'white', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #f3f4f6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {ev.thumbnail && <img src={ev.thumbnail} alt={ev.titulo} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />}
                  <div>
                    <h3 className={lexend.className} style={{ fontSize: '16px', color: 'black', letterSpacing: '-0.03em', marginBottom: '4px' }}>{ev.titulo}</h3>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                      {ev.tipo && <span style={{ fontSize: '11px', background: '#f3f4f6', color: '#6b7280', padding: '2px 8px', borderRadius: '20px' }}>{ev.tipo}</span>}
                      <span style={{ fontSize: '11px', color: '#9ca3af' }}>{fmt(ev.data_inicio)}{ev.data_fim ? ' - ' + fmt(ev.data_fim) : ''}</span>
                      {ev.local && <span style={{ fontSize: '11px', color: '#9ca3af' }}>· {ev.local}</span>}
                      <span style={{ fontSize: '11px', color: ev.publicado ? '#22c55e' : '#f59e0b', fontWeight: '600' }}>{ev.publicado ? 'Publicado' : 'Rascunho'}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={function() { togglePublicado(ev.id, ev.publicado) }}
                    style={{ background: ev.publicado ? '#fef3c7' : '#f0fdf4', color: ev.publicado ? '#92400e' : '#166534', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}>
                    {ev.publicado ? 'Despublicar' : 'Publicar'}
                  </button>
                  <button onClick={function() { router.push('/admin/eventos/' + ev.id) }}
                    style={{ background: '#f3f4f6', color: 'black', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}>
                    Editar
                  </button>
                  <button onClick={function() { excluir(ev.id) }}
                    style={{ background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}>
                    Excluir
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
