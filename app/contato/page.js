'use client'
import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Lexend } from 'next/font/google'

const lexend = Lexend({ subsets: ['latin'], weight: '700' })

const ACCESS_KEY = 'f3a85c27-1331-4153-9b70-4d648c39854d'
const input = { width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #eceef1', fontSize: '15px', outline: 'none', boxSizing: 'border-box', background: 'white', color: '#111' }
const label = { fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px', fontWeight: '700' }

export default function Contato() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [status, setStatus] = useState(null) // 'ok' | 'erro'

  async function enviar() {
    if (!nome.trim() || !email.trim() || !mensagem.trim()) {
      setStatus('faltando'); return
    }
    setEnviando(true)
    setStatus(null)
    try {
      const resp = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: 'Nova mensagem pelo site GaropabaSurf',
          from_name: nome,
          name: nome,
          email: email,
          message: mensagem,
        }),
      })
      const data = await resp.json()
      if (data.success) {
        setStatus('ok'); setNome(''); setEmail(''); setMensagem('')
      } else {
        setStatus('erro')
      }
    } catch (e) {
      setStatus('erro')
    }
    setEnviando(false)
  }

  return (
    <div className='min-h-screen bg-white'>
      <Navbar />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '90px 16px 70px' }}>

        <h1 className={lexend.className} style={{ fontSize: '32px', color: '#111', letterSpacing: '-0.06em', marginBottom: '6px' }}>Contato</h1>
        <p style={{ fontSize: '15px', color: '#6b7280', marginBottom: '32px' }}>Dúvidas, sugestões, parcerias ou só pra trocar ideia sobre surf? Manda mensagem.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>

          {/* FORMULARIO */}
          <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #eceef1', padding: '28px' }}>
            {status === 'ok' && <div style={{ background: '#f0fdf4', color: '#15803d', padding: '12px 16px', borderRadius: '10px', marginBottom: '18px', fontSize: '14px' }}>Mensagem enviada! Em breve respondemos. 🤙</div>}
            {status === 'erro' && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '10px', marginBottom: '18px', fontSize: '14px' }}>Algo deu errado. Tenta de novo ou escreve direto para contato@garopabasurf.app</div>}
            {status === 'faltando' && <div style={{ background: '#fffbeb', color: '#b45309', padding: '12px 16px', borderRadius: '10px', marginBottom: '18px', fontSize: '14px' }}>Preencha nome, email e mensagem.</div>}

            <label style={label}>Seu nome</label>
            <input value={nome} onChange={function(e){ setNome(e.target.value) }} placeholder='Como te chamamos' style={Object.assign({}, input, { marginBottom: '18px' })} />

            <label style={label}>Seu email</label>
            <input type='email' value={email} onChange={function(e){ setEmail(e.target.value) }} placeholder='seu@email.com' style={Object.assign({}, input, { marginBottom: '18px' })} />

            <label style={label}>Mensagem</label>
            <textarea value={mensagem} onChange={function(e){ setMensagem(e.target.value) }} placeholder='Escreva sua mensagem...' rows={5} style={Object.assign({}, input, { marginBottom: '20px', resize: 'vertical', fontFamily: 'inherit' })} />

            <button onClick={enviar} disabled={enviando} className={lexend.className} style={{ width: '100%', padding: '14px', background: 'black', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', cursor: enviando ? 'default' : 'pointer', opacity: enviando ? 0.6 : 1 }}>
              {enviando ? 'Enviando...' : 'Enviar mensagem'}
            </button>
          </div>

          {/* CONTATOS DIRETOS */}
          <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #eceef1', padding: '28px' }}>
            <div className={lexend.className} style={{ fontSize: '16px', color: '#111', marginBottom: '16px' }}>Ou fale direto com a gente</div>

            <a href='mailto:contato@garopabasurf.app' style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 0', borderBottom: '1px solid #f3f4f6', textDecoration: 'none' }}>
              <span style={{ fontSize: '20px' }}>✉️</span>
              <div>
                <div style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Email</div>
                <div className={lexend.className} style={{ fontSize: '15px', color: '#111' }}>contato@garopabasurf.app</div>
              </div>
            </a>

            <a href='https://instagram.com/garopabasurf' target='_blank' rel='noreferrer' style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 0', textDecoration: 'none' }}>
              <span style={{ fontSize: '20px' }}>📸</span>
              <div>
                <div style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Instagram</div>
                <div className={lexend.className} style={{ fontSize: '15px', color: '#111' }}>@garopabasurf</div>
              </div>
            </a>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  )
}
