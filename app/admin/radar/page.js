'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lexend } from 'next/font/google'
import { useAuth } from '../../components/AuthContext'

const lexend = Lexend({ subsets: ['latin'], weight: '700' })
const ADMIN_ID = 'b20f6b3d-9e42-4445-a4a5-6509aee5bcb5'

function tempoAtras(data) {
  if (!data) return ''
  const seg = Math.floor((Date.now() - new Date(data)) / 1000)
  if (seg < 3600) return Math.floor(seg/60) + 'min atrás'
  if (seg < 86400) return Math.floor(seg/3600) + 'h atrás'
  return Math.floor(seg/86400) + 'd atrás'
}

export default function Radar() {
  const router = useRouter()
  const { user, loading: authLoading, sair: sairAuth } = useAuth()
  const [noticias, setNoticias] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(function() {
    if (authLoading) return
    if (!user || user.id !== ADMIN_ID) { router.replace('/admin'); return }
    carregar()
  }, [user, authLoading])

  function carregar() {
    setLoading(true)
    fetch('/api/radar').then(function(r){ return r.json() }).then(function(d) {
      setNoticias(d.noticias || [])
      setLoading(false)
    }).catch(function(){ setLoading(false) })
  }

  async function sair() { await sairAuth(); router.push('/') }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <div style={{ background: 'black', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 className={lexend.className} style={{ color: 'white', fontSize: '20px', letterSpacing: '-0.06em' }}>garopabasurf radar</h1>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <a href='/admin' style={{ color: '#9ca3af', fontSize: '13px', textDecoration: 'none' }}>Painel</a>
          <a href='/admin/posts' style={{ color: '#9ca3af', fontSize: '13px', textDecoration: 'none' }}>Blog</a>
          <a href='/admin/eventos' style={{ color: '#9ca3af', fontSize: '13px', textDecoration: 'none' }}>Eventos</a>
          <a href='/admin/videos' style={{ color: '#9ca3af', fontSize: '13px', textDecoration: 'none' }}>TV</a>
          <a href='/admin/radar' style={{ color: 'white', fontSize: '13px', textDecoration: 'none', fontWeight: '700' }}>Radar</a>
          <button onClick={sair} style={{ background: 'transparent', color: '#9ca3af', border: '1px solid #374151', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer' }}>Sair</button>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <h2 className={lexend.className} style={{ fontSize: '24px', color: 'black', letterSpacing: '-0.06em' }}>Radar de Notícias</h2>
          <button onClick={carregar} style={{ background: '#f3f4f6', color: '#111', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer' }}>Atualizar</button>
        </div>
        <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '28px' }}>Manchetes de surf do Brasil e do mundo. Use como inspiração para suas próprias matérias.</p>

        {loading && <p style={{ color: '#9ca3af' }}>Buscando manchetes...</p>}
        {!loading && noticias.length === 0 && <p style={{ color: '#9ca3af' }}>Nenhuma manchete encontrada agora. Tente atualizar.</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {noticias.map(function(n, i) {
            return (
              <a key={i} href={n.link} target='_blank' rel='noreferrer' style={{ textDecoration: 'none', background: 'white', borderRadius: '12px', padding: '16px 18px', border: '1px solid #f3f4f6', display: 'block' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#0369a1', background: '#e0f2fe', padding: '2px 8px', borderRadius: '20px' }}>{n.fonte}</span>
                  <span style={{ fontSize: '11px', color: '#9ca3af' }}>{tempoAtras(n.data)}</span>
                </div>
                <h3 className={lexend.className} style={{ fontSize: '16px', color: '#111', letterSpacing: '-0.03em', lineHeight: '1.3', marginBottom: '4px' }}>{n.titulo}</h3>
                {n.resumo && <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.5' }}>{n.resumo}...</p>}
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}
