'use client'
import { Young_Serif } from 'next/font/google'
import { Lexend } from 'next/font/google'
import { useAuth } from './AuthContext'

const youngSerif = Young_Serif({ subsets: ['latin'], weight: '400' })
const lexend = Lexend({ subsets: ['latin'], weight: '500' })


export default function Footer() {
  const { user, abrirModal } = useAuth()
  return (
    <>
      <footer className='w-full bg-black text-white py-12 hidden md:block'>
        <div className='max-w-[70%] mx-auto' style={{ display: 'flex', justifyContent: 'space-between', gap: '48px' }}>
          <div style={{ maxWidth: '300px' }}>
            <img src='/garopabasurf.png' alt='GaropabaSurf' style={{ height: '34px', width: 'auto', display: 'block' }} />
            <p style={{ color: '#d1d5db', fontSize: '14px', lineHeight: '1.6', marginTop: '12px' }}>Previsão, reports e picos de surf em Garopaba e região. O seu confere antes de cair.</p>
            <a href='https://instagram.com/garopabasurf' target='_blank' rel='noopener noreferrer' style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#fff', textDecoration: 'none', marginTop: '16px', fontSize: '14px', borderRadius: '8px', padding: '6px 10px', marginLeft: '-10px' }} onMouseEnter={function(e){ e.currentTarget.style.background='white'; e.currentTarget.style.color='black' }} onMouseLeave={function(e){ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#fff' }}>
              <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><rect x='2' y='2' width='20' height='20' rx='5' ry='5'/><path d='M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z'/><line x1='17.5' y1='6.5' x2='17.51' y2='6.5'/></svg>
              @garopabasurf
            </a>
          </div>

          <div>
            <p className={lexend.className} style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#fff', marginBottom: '14px' }}>Navegação</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
              {[['/praias','Praias'],['/blog','Blog'],['/eventos','Eventos']].map(function(l) {
                return <a key={l[0]} href={l[0]} className={lexend.className} style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '13px', borderRadius: '8px', padding: '6px 12px', display: 'block' }} onMouseEnter={function(e){ e.currentTarget.style.background='white'; e.currentTarget.style.color='black' }} onMouseLeave={function(e){ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#d1d5db' }}>{l[1]}</a>
              })}
            </div>
          </div>
        </div>

        <div className='max-w-[70%] mx-auto mt-12 pt-6 border-t border-gray-800' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
          <span style={{ color: '#9ca3af' }}>{new Date().getFullYear()} GaropabaSurf. Todos os direitos reservados.</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[['/contato','Contato'],['/privacidade','Privacidade'],['/termos','Termos de Uso'],['/cookies','Cookies']].map(function(l) {
              return <a key={l[0]} href={l[0]} style={{ color: '#d1d5db', textDecoration: 'none', borderRadius: '8px', padding: '6px 12px', display: 'block' }} onMouseEnter={function(e){ e.currentTarget.style.background='white'; e.currentTarget.style.color='black' }} onMouseLeave={function(e){ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#d1d5db' }}>{l[1]}</a>
            })}
          </div>
        </div>
      </footer>

      <nav className='md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200' style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999 }}>
        <link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200' />
        <div className='flex items-center justify-around py-2'>
          <a href='/' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', textDecoration: 'none', color: '#9ca3af', flex: 1 }}>
            <span className='material-symbols-outlined' style={{ fontSize: '24px' }}>home</span>
            <span style={{ fontSize: '10px', fontFamily: 'sans-serif' }}>Principal</span>
          </a>
          <a href='/praias' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', textDecoration: 'none', color: '#9ca3af', flex: 1 }}>
            <span className='material-symbols-outlined' style={{ fontSize: '24px' }}>beach_access</span>
            <span style={{ fontSize: '10px', fontFamily: 'sans-serif' }}>Praias</span>
          </a>
          <a href='/favoritos' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', textDecoration: 'none', color: '#9ca3af', flex: 1 }}>
            <span className='material-symbols-outlined' style={{ fontSize: '24px' }}>favorite</span>
            <span style={{ fontSize: '10px', fontFamily: 'sans-serif' }}>Favoritos</span>
          </a>
          <button onClick={function() { if (user) { window.location.href = '/perfil' } else { abrirModal() } }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', background: 'none', border: 'none', color: user ? '#111' : '#9ca3af', flex: 1, cursor: 'pointer' }}>
            <span className='material-symbols-outlined' style={{ fontSize: '24px' }}>person</span>
            <span style={{ fontSize: '10px', fontFamily: 'sans-serif' }}>Perfil</span>
          </button>
        </div>
      </nav>

      <div className='md:hidden' style={{ height: '64px' }} />
    </>
  )
}
