'use client'
import { useState } from 'react'
import { Lexend } from 'next/font/google'
import { useAuth } from './AuthContext'

const lexend = Lexend({ subsets: ['latin'], weight: '700' })

export default function AuthModal() {
  const { modalAberto, fecharModal, entrar, cadastrar } = useAuth()
  const [modo, setModo] = useState('entrar')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  if (!modalAberto) return null

  function limpar() {
    setNome(''); setEmail(''); setSenha(''); setErro(''); setCarregando(false)
  }

  async function submeter() {
    setErro('')
    if (!email || !senha || (modo === 'cadastrar' && !nome)) {
      setErro('Preencha todos os campos.')
      return
    }
    setCarregando(true)
    let res
    if (modo === 'entrar') {
      res = await entrar(email, senha)
    } else {
      res = await cadastrar(nome, email, senha)
    }
    setCarregando(false)
    if (res.error) {
      const m = res.error.message || ''
      if (m.includes('Invalid login')) setErro('Email ou senha incorretos.')
      else if (m.includes('already registered') || m.includes('already been registered')) setErro('Este email ja esta cadastrado.')
      else if (m.includes('Password should be')) setErro('A senha precisa ter ao menos 6 caracteres.')
      else setErro('Algo deu errado. Tente novamente.')
      return
    }
    limpar()
    fecharModal()
  }

  return (
    <div onClick={fecharModal} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div onClick={function(e) { e.stopPropagation() }} style={{ background: '#fff', borderRadius: '18px', width: '100%', maxWidth: '400px', padding: '32px', position: 'relative', boxShadow: '0 10px 40px rgba(0,0,0,0.25)' }}>
        <button onClick={fecharModal} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#9ca3af', lineHeight: 1 }}>&times;</button>

        <h2 className={lexend.className} style={{ fontSize: '26px', fontWeight: '700', letterSpacing: '-0.05em', color: '#111', marginBottom: '6px' }}>{modo === 'entrar' ? 'Entrar' : 'Criar conta'}</h2>
        <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '24px' }}>{modo === 'entrar' ? 'Acesse sua conta GaropabaSurf.' : 'Cadastre-se para salvar praias e comentar.'}</p>

        {modo === 'cadastrar' && (
          <input value={nome} onChange={function(e) { setNome(e.target.value) }} placeholder='Nome'
            style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '14px', marginBottom: '12px', outline: 'none', boxSizing: 'border-box', color: '#111', background: '#fff' }} />
        )}
        <input value={email} onChange={function(e) { setEmail(e.target.value) }} type='email' placeholder='Email'
          style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '14px', marginBottom: '12px', outline: 'none', boxSizing: 'border-box', color: '#111', background: '#fff' }} />
        <input value={senha} onChange={function(e) { setSenha(e.target.value) }} type='password' placeholder='Senha'
          onKeyDown={function(e) { if (e.key === 'Enter') submeter() }}
          style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '14px', marginBottom: '12px', outline: 'none', boxSizing: 'border-box', color: '#111', background: '#fff' }} />

        {erro && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px' }}>{erro}</p>}

        <button onClick={submeter} disabled={carregando}
          style={{ width: '100%', padding: '13px', borderRadius: '10px', background: '#000', color: '#fff', fontSize: '14px', fontWeight: '700', border: 'none', cursor: carregando ? 'default' : 'pointer', opacity: carregando ? 0.6 : 1 }}>
          {carregando ? 'Aguarde...' : (modo === 'entrar' ? 'Entrar' : 'Criar conta')}
        </button>

        <p style={{ fontSize: '13px', color: '#6b7280', textAlign: 'center', marginTop: '18px' }}>
          {modo === 'entrar' ? 'Nao tem conta? ' : 'Ja tem conta? '}
          <button onClick={function() { setModo(modo === 'entrar' ? 'cadastrar' : 'entrar'); setErro('') }}
            style={{ background: 'none', border: 'none', color: '#000', fontWeight: '700', cursor: 'pointer', fontSize: '13px', textDecoration: 'underline' }}>
            {modo === 'entrar' ? 'Cadastre-se' : 'Entrar'}
          </button>
        </p>
      </div>
    </div>
  )
}
