'use client'
import { useState } from 'react'
import { Young_Serif } from 'next/font/google'
import { Lexend } from 'next/font/google'
import Link from 'next/link'
import { useAuth } from './AuthContext'

const youngSerif = Young_Serif({ subsets: ['latin'], weight: '400' })
const lexend = Lexend({ subsets: ['latin'], weight: '500' })

const links = [
  { href: '/', label: 'Principal' },
  { href: '/praias', label: 'Praias' },
]

export default function Navbar() {
  const [aberto, setAberto] = useState(false)
  const { user, perfil, abrirModal, sair } = useAuth()
  return (
    <div className='fixed top-0 left-0 w-full bg-black' style={{ zIndex: 9999 }}>
      <nav className='hidden md:flex max-w-[70%] mx-auto text-white px-6 py-4 items-center justify-between'>
        <Link href='/' className={youngSerif.className} style={{ fontSize: '28px', color: 'white', letterSpacing: '-0.1em', lineHeight: '1', textDecoration: 'none' }}>
          garopabasurf
        </Link>
        <ul className='flex gap-2' style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {links.map(function(l) {
            return (
              <li key={l.href}>
                <a href={l.href} className={lexend.className} style={{ fontSize: '14px', color: 'white', textDecoration: 'none', borderRadius: '10px', padding: '8px 16px', display: 'block' }} onMouseEnter={function(e) { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = 'black' }} onMouseLeave={function(e) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'white' }}>
                  {l.label}
                </a>
              </li>
            )
          })}
          <li style={{ marginLeft: '8px' }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className={lexend.className} style={{ fontSize: '14px', color: 'white' }}>{perfil && perfil.nome ? perfil.nome.split(' ')[0] : 'Perfil'}</span>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#374151', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', overflow: 'hidden' }}>
                  {perfil && perfil.avatar_url ? <img src={perfil.avatar_url} alt='' style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (perfil && perfil.nome ? perfil.nome[0].toUpperCase() : 'U')}
                </div>
                <button onClick={sair} className={lexend.className} style={{ fontSize: '13px', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer' }}>Sair</button>
              </div>
            ) : (
              <button onClick={abrirModal} className={lexend.className} style={{ fontSize: '14px', color: 'black', background: 'white', border: 'none', borderRadius: '10px', padding: '8px 18px', cursor: 'pointer', fontWeight: '700' }}>Entrar</button>
            )}
          </li>
        </ul>
      </nav>
      <div className='md:hidden'>
        <div className='flex items-center justify-between px-4 py-4'>
          <div style={{ width: '40px' }} />
          <Link href='/' className={youngSerif.className} style={{ fontSize: '26px', color: 'white', letterSpacing: '-0.1em', lineHeight: '1', textDecoration: 'none' }}>
            garopabasurf
          </Link>
          <button onClick={function() { setAberto(!aberto) }} style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer', width: '40px', textAlign: 'right' }}>
            {aberto ? 'x' : '='}
          </button>
        </div>
        {aberto && (
          <div className='flex flex-col px-4 pb-4 gap-1'>
            {links.map(function(l) {
              return (
                <a key={l.href} href={l.href} className={lexend.className} style={{ display: 'block', padding: '10px 16px', color: 'white', textDecoration: 'none', fontSize: '15px', borderRadius: '10px' }} onClick={function() { setAberto(false) }}>
                  {l.label}
                </a>
              )
            })}
            {user ? (
              <>
                <div className={lexend.className} style={{ padding: '10px 16px', color: 'white', fontSize: '15px' }}>Ola, {perfil && perfil.nome ? perfil.nome.split(' ')[0] : 'surfista'}</div>
                <button onClick={function() { sair(); setAberto(false) }} className={lexend.className} style={{ textAlign: 'left', padding: '10px 16px', color: '#9ca3af', background: 'none', border: 'none', fontSize: '15px', cursor: 'pointer' }}>Sair</button>
              </>
            ) : (
              <button onClick={function() { abrirModal(); setAberto(false) }} className={lexend.className} style={{ textAlign: 'center', padding: '12px', margin: '4px 0', color: 'black', background: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}>Entrar</button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}