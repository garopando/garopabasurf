'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lexend } from 'next/font/google'
import { useAuth } from '../components/AuthContext'

const lexend = Lexend({ subsets: ['latin'], weight: '700' })
const lexendNormal = Lexend({ subsets: ['latin'], weight: '400' })

const ADMIN_ID = 'b20f6b3d-9e42-4445-a4a5-6509aee5bcb5'

export default function AdminLogin() {
  const { user, loading, abrirModal } = useAuth()
  const router = useRouter()
  const [verificando, setVerificando] = useState(true)

  useEffect(function() {
    if (loading) return
    if (user && user.id === ADMIN_ID) {
      router.replace('/admin/posts')
    } else {
      setVerificando(false)
    }
  }, [user, loading])

  if (loading || verificando) {
    return (
      <div style={{ minHeight: '100vh', background: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
        Verificando acesso...
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ background: 'white', borderRadius: '24px', padding: '48px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h1 className={lexend.className} style={{ fontSize: '28px', letterSpacing: '-0.06em', color: 'black', marginBottom: '8px' }}>garopabasurf</h1>
        <p className={lexendNormal.className} style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '32px' }}>Area administrativa</p>
        {user ? (
          <p className={lexendNormal.className} style={{ color: '#ef4444', fontSize: '14px' }}>Esta conta nao tem permissao de administrador.</p>
        ) : (
          <button onClick={abrirModal} className={lexend.className}
            style={{ width: '100%', padding: '12px', background: 'black', color: 'white', borderRadius: '12px', border: 'none', fontSize: '14px', cursor: 'pointer' }}>
            Fazer login
          </button>
        )}
        <a href='/' className={lexendNormal.className} style={{ display: 'block', marginTop: '20px', color: '#9ca3af', fontSize: '13px', textDecoration: 'none' }}>Voltar ao site</a>
      </div>
    </div>
  )
}
