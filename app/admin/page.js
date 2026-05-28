'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lexend } from 'next/font/google'

const lexend = Lexend({ subsets: ['latin'], weight: '700' })
const lexendNormal = Lexend({ subsets: ['latin'], weight: '400' })

export default function AdminLogin() {
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const router = useRouter()

  function handleLogin() {
    if (senha === 'garopabasurf2024') {
      localStorage.setItem('admin_auth', 'true')
      router.push('/admin/posts')
    } else {
      setErro('Senha incorreta')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', borderRadius: '24px', padding: '48px', width: '100%', maxWidth: '400px' }}>
        <h1 className={lexend.className} style={{ fontSize: '28px', letterSpacing: '-0.06em', color: 'black', marginBottom: '8px' }}>garopabasurf</h1>
        <p className={lexendNormal.className} style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '32px' }}>Área administrativa</p>
        <input
          type='password'
          placeholder='Senha'
          value={senha}
          onChange={function(e) { setSenha(e.target.value) }}
          onKeyDown={function(e) { if (e.key === 'Enter') handleLogin() }}
          style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '14px', outline: 'none', marginBottom: '12px', boxSizing: 'border-box' }}
        />
        {erro && <p style={{ color: 'red', fontSize: '12px', marginBottom: '12px' }}>{erro}</p>}
        <button
          onClick={handleLogin}
          className={lexend.className}
          style={{ width: '100%', padding: '12px', background: 'black', color: 'white', borderRadius: '12px', border: 'none', fontSize: '14px', cursor: 'pointer' }}
        >
          Entrar
        </button>
      </div>
    </div>
  )
}
