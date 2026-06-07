'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import { Lexend } from 'next/font/google'
import { useAuth } from '../../components/AuthContext'

const lexend = Lexend({ subsets: ['latin'], weight: '700' })
const ADMIN_ID = 'b20f6b3d-9e42-4445-a4a5-6509aee5bcb5'

export default function AdminVideos() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { user, loading: authLoading, sair: sairAuth } = useAuth()

  useEffect(function() {
    if (authLoading) return
    if (!user || user.id !== ADMIN_ID) { router.replace('/admin'); return }
    carregar()
  }, [user, authLoading])

  async function carregar() {
    const { data } = await supabase.from('videos').select('*').order('criado_em', { ascending: false })
    setVideos(data || [])
    setLoading(false)
  }
  async function excluir(id) {
    if (!confirm('Excluir este vídeo?')) return
    await supabase.from('videos').delete().eq('id', id)
    carregar()
  }
  async function togglePublicado(id, pub) {
    await supabase.from('videos').update({ publicado: !pub }).eq('id', id)
    carregar()
  }
  async function sair() { await sairAuth(); router.push('/') }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <div style={{ background: 'black', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 className={lexend.className} style={{ color: 'white', fontSize: '20px', letterSpacing: '-0.06em' }}>garopabasurf tv</h1>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <a href='/admin' style={{ color: '#9ca3af', fontSize: '13px', textDecoration: 'none' }}>Painel</a>
          <a href='/admin/posts' style={{ color: '#9ca3af', fontSize: '13px', textDecoration: 'none' }}>Blog</a>
          <a href='/admin/eventos' style={{ color: '#9ca3af', fontSize: '13px', textDecoration: 'none' }}>Eventos</a>
          <a href='/admin/videos' style={{ color: 'white', fontSize: '13px', textDecoration: 'none', fontWeight: '700' }}>TV</a>
          <a href='/admin/radar' style={{ color: '#9ca3af', fontSize: '13px', textDecoration: 'none' }}>Radar</a>
          <a href='/' target='_blank' rel='noreferrer' style={{ color: '#9ca3af', fontSize: '13px', textDecoration: 'none' }}>Ver site ↗</a>
          <button onClick={function() { router.push('/admin/videos/novo') }}
            style={{ background: 'white', color: 'black', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', fontWeight: '700' }}>
            + Novo Vídeo
          </button>
          <button onClick={sair} style={{ background: 'transparent', color: '#9ca3af', border: '1px solid #374151', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer' }}>Sair</button>
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 16px' }}>
        <h2 className={lexend.className} style={{ fontSize: '24px', color: 'black', letterSpacing: '-0.06em', marginBottom: '24px' }}>Vídeos</h2>
        {loading && <p style={{ color: '#9ca3af' }}>Carregando...</p>}
        {!loading && videos.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
            <p>Nenhum vídeo ainda.</p>
            <button onClick={function() { router.push('/admin/videos/novo') }}
              style={{ marginTop: '16px', background: 'black', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer', fontWeight: '700' }}>
              Adicionar primeiro vídeo
            </button>
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {videos.map(function(v) {
            return (
              <div key={v.id} style={{ background: 'white', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #f3f4f6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img src={'https://img.youtube.com/vi/' + v.youtube_id + '/mqdefault.jpg'} alt={v.titulo} style={{ width: '100px', height: '56px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div>
                    <h3 className={lexend.className} style={{ fontSize: '16px', color: 'black', letterSpacing: '-0.03em', marginBottom: '4px' }}>{v.titulo}</h3>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {v.categoria && <span style={{ fontSize: '11px', background: '#f3f4f6', color: '#6b7280', padding: '2px 8px', borderRadius: '20px' }}>{v.categoria}</span>}
                      <span style={{ fontSize: '11px', color: v.publicado ? '#22c55e' : '#f59e0b', fontWeight: '600' }}>{v.publicado ? 'Publicado' : 'Rascunho'}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={function() { togglePublicado(v.id, v.publicado) }}
                    style={{ background: v.publicado ? '#fef3c7' : '#f0fdf4', color: v.publicado ? '#92400e' : '#166534', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}>
                    {v.publicado ? 'Despublicar' : 'Publicar'}
                  </button>
                  <button onClick={function() { window.open('/tv/' + v.slug, '_blank') }}
                    style={{ background: '#eff6ff', color: '#3b82f6', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}>Ver</button>
                  <button onClick={function() { router.push('/admin/videos/' + v.id) }}
                    style={{ background: '#f3f4f6', color: 'black', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}>Editar</button>
                  <button onClick={function() { excluir(v.id) }}
                    style={{ background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}>Excluir</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
