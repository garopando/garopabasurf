'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lexend } from 'next/font/google'
import { useAuth } from '../components/AuthContext'

const lexend = Lexend({ subsets: ['latin'], weight: '700' })
const lexendNormal = Lexend({ subsets: ['latin'], weight: '400' })
const ADMIN_ID = 'b20f6b3d-9e42-4445-a4a5-6509aee5bcb5'

export default function AdminPainel() {
  const { user, loading, abrirModal, sair } = useAuth()
  const router = useRouter()
  const [verificando, setVerificando] = useState(true)

  useEffect(function() {
    if (loading) return
    setVerificando(false)
  }, [user, loading])

  if (loading || verificando) {
    return <div style={{ minHeight: '100vh', background: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>Verificando acesso...</div>
  }

  // nao logado ou nao-admin: barra
  if (!user || user.id !== ADMIN_ID) {
    return (
      <div style={{ minHeight: '100vh', background: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
        <div style={{ background: 'white', borderRadius: '24px', padding: '48px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <h1 className={lexend.className} style={{ fontSize: '28px', letterSpacing: '-0.06em', color: 'black', marginBottom: '8px' }}>garopabasurf</h1>
          <p className={lexendNormal.className} style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '32px' }}>Area administrativa</p>
          {user ? (
            <p className={lexendNormal.className} style={{ color: '#ef4444', fontSize: '14px' }}>Esta conta nao tem permissao de administrador.</p>
          ) : (
            <button onClick={abrirModal} className={lexend.className} style={{ width: '100%', padding: '12px', background: 'black', color: 'white', borderRadius: '12px', border: 'none', fontSize: '14px', cursor: 'pointer' }}>Fazer login</button>
          )}
          <a href='/' className={lexendNormal.className} style={{ display: 'block', marginTop: '20px', color: '#9ca3af', fontSize: '13px', textDecoration: 'none' }}>Voltar ao site</a>
        </div>
      </div>
    )
  }

  const areas = [
    { nome: 'Blog', desc: 'Notícias e artigos', href: '/admin/posts', icone: '📝' },
    { nome: 'Eventos', desc: 'Campeonatos e eventos locais', href: '/admin/eventos', icone: '📅' },
    { nome: 'TV', desc: 'Vídeos do YouTube', href: '/admin/videos', icone: '📺' },
    { nome: 'Radar', desc: 'Manchetes de surf pra inspiração', href: '/admin/radar', icone: '📡' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <div style={{ background: 'black', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 className={lexend.className} style={{ color: 'white', fontSize: '20px', letterSpacing: '-0.06em' }}>garopabasurf admin</h1>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <a href='/' target='_blank' rel='noreferrer' style={{ color: '#9ca3af', fontSize: '13px', textDecoration: 'none' }}>Ver site ↗</a>
          <button onClick={function(){ sair(); router.push('/') }} style={{ background: 'transparent', color: '#9ca3af', border: '1px solid #374151', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer' }}>Sair</button>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 16px' }}>
        <h2 className={lexend.className} style={{ fontSize: '28px', color: 'black', letterSpacing: '-0.06em', marginBottom: '6px' }}>Painel</h2>
        <p className={lexendNormal.className} style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '32px' }}>Escolha uma área para gerenciar.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {areas.map(function(a) {
            return (
              <a key={a.href} href={a.href} style={{ textDecoration: 'none', background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #f3f4f6', transition: 'box-shadow 0.15s', display: 'block' }}
                onMouseEnter={function(e){ e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)' }}
                onMouseLeave={function(e){ e.currentTarget.style.boxShadow = 'none' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{a.icone}</div>
                <h3 className={lexend.className} style={{ fontSize: '18px', color: '#111', letterSpacing: '-0.03em', marginBottom: '4px' }}>{a.nome}</h3>
                <p className={lexendNormal.className} style={{ fontSize: '13px', color: '#9ca3af' }}>{a.desc}</p>
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}
