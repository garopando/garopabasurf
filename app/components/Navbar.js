'use client'
import { useState } from 'react'
import { Young_Serif } from 'next/font/google'
import { Lexend } from 'next/font/google'

const youngSerif = Young_Serif({ subsets: ['latin'], weight: '400' })
const lexend = Lexend({ subsets: ['latin'], weight: '500' })

const links = [
  { href: '/', label: 'Principal' },
  { href: '/garopaba', label: 'Garopaba' },
  { href: '/praias', label: 'Praias' },
  { href: '/noticias', label: 'Notícias' },
  { href: '/fale-conosco', label: 'Fale conosco' },
]

export default function Navbar() {
  const [aberto, setAberto] = useState(false)

  return (
    <div className='fixed top-0 left-0 w-full bg-black z-50'>
      <nav className='hidden md:flex max-w-[70%] mx-auto text-white px-6 py-4 items-center justify-between'>
        <a href='/' className={youngSerif.className} style={{ fontSize: '28px', color: 'white', letterSpacing: '-0.1em', lineHeight: '1' }}>
          garopabasurf
        </a>
        <ul className='flex gap-2'>
          {links.map(function(l) {
            return (
              <li key={l.href}>
                <a href={l.href} className={lexend.className + ' px-4 py-2 rounded-[10px] transition block'} style={{ fontSize: '14px', color: 'white', textDecoration: 'none' }} onMouseEnter={function(e){ e.target.style.background='white'; e.target.style.color='black' }} onMouseLeave={function(e){ e.target.style.background='transparent'; e.target.style.color='white' }}>
                  {l.label}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className='md:hidden'>
        <div className='flex items-center justify-between px-4 py-4'>
          <div style={{ width: '40px' }} />
          <a href='/' className={youngSerif.className} style={{ fontSize: '26px', color: 'white', letterSpacing: '-0.1em', lineHeight: '1', textDecoration: 'none' }}>
            garopabasurf
          </a>
          <button onClick={function() { setAberto(!aberto) }} style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer', width: '40px', textAlign: 'right' }}>
            {aberto ? '✕' : '☰'}
          </button>
        </div>
        {aberto && (
          <div className='flex flex-col px-4 pb-4 gap-1'>
            {links.map(function(l) {
              return (
                <a key={l.href} href={l.href} className={lexend.className} style={{ display: 'block', padding: '10px 16px', color: 'white', textDecoration: 'none', fontSize: '15px', borderRadius: '10px' }}
                  onClick={function() { setAberto(false) }}>
                  {l.label}
                </a>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
