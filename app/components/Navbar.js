import { Young_Serif } from 'next/font/google'
import { Lexend } from 'next/font/google'

const youngSerif = Young_Serif({ subsets: ['latin'], weight: '400' })
const lexend = Lexend({ subsets: ['latin'], weight: '500' })

export default function Navbar() {
  return (
    <div className='fixed top-0 left-0 w-full bg-black z-50'>
      <nav className='max-w-[70%] mx-auto text-white px-6 py-4 flex items-center justify-between hidden md:flex'>
        <div>
          <a href='/' className={youngSerif.className} style={{ fontSize: '28px', color: 'white', letterSpacing: '-0.1em', lineHeight: '1' }}>
            garopabasurf
          </a>
        </div>
        <ul className='flex gap-2'>
          <li><a href='/' className={lexend.className + ' px-4 py-2 rounded-[10px] hover:bg-white hover:text-black transition block'} style={{ fontSize: '14px' }}>Principal</a></li>
          <li><a href='/garopaba' className={lexend.className + ' px-4 py-2 rounded-[10px] hover:bg-white hover:text-black transition block'} style={{ fontSize: '14px' }}>Garopaba</a></li>
          <li><a href='/praias' className={lexend.className + ' px-4 py-2 rounded-[10px] hover:bg-white hover:text-black transition block'} style={{ fontSize: '14px' }}>Praias</a></li>
          <li><a href='/noticias' className={lexend.className + ' px-4 py-2 rounded-[10px] hover:bg-white hover:text-black transition block'} style={{ fontSize: '14px' }}>Notícias</a></li>
          <li><a href='/fale-conosco' className={lexend.className + ' px-4 py-2 rounded-[10px] hover:bg-white hover:text-black transition block'} style={{ fontSize: '14px' }}>Fale conosco</a></li>
        </ul>
      </nav>
      <NavbarMobile youngSerif={youngSerif} lexend={lexend} />
    </div>
  )
}

function NavbarMobile({ youngSerif, lexend }) {
  return (
    <div className='md:hidden'>
      <input type='checkbox' id='menu-toggle' className='hidden' />
      <div className='flex items-center justify-between px-4 py-4'>
        <div style={{ width: '40px' }} />
        <a href='/' className={youngSerif.className} style={{ fontSize: '26px', color: 'white', letterSpacing: '-0.1em', lineHeight: '1' }}>
          garopabasurf
        </a>
        <label htmlFor='menu-toggle' style={{ cursor: 'pointer', color: 'white', fontSize: '24px', width: '40px', textAlign: 'right' }}>
          ☰
        </label>
      </div>
      <style>{
        \`#menu-toggle:checked ~ div { display: flex; }
        #menu-toggle ~ div { display: none; }\`
      }</style>
      <div className='flex-col px-4 pb-4 gap-1'>
        <a href='/' className={lexend.className} style={{ display: 'block', padding: '10px 16px', color: 'white', textDecoration: 'none', fontSize: '15px', borderRadius: '10px' }}>Principal</a>
        <a href='/garopaba' className={lexend.className} style={{ display: 'block', padding: '10px 16px', color: 'white', textDecoration: 'none', fontSize: '15px', borderRadius: '10px' }}>Garopaba</a>
        <a href='/praias' className={lexend.className} style={{ display: 'block', padding: '10px 16px', color: 'white', textDecoration: 'none', fontSize: '15px', borderRadius: '10px' }}>Praias</a>
        <a href='/noticias' className={lexend.className} style={{ display: 'block', padding: '10px 16px', color: 'white', textDecoration: 'none', fontSize: '15px', borderRadius: '10px' }}>Notícias</a>
        <a href='/fale-conosco' className={lexend.className} style={{ display: 'block', padding: '10px 16px', color: 'white', textDecoration: 'none', fontSize: '15px', borderRadius: '10px' }}>Fale conosco</a>
      </div>
    </div>
  )
}
