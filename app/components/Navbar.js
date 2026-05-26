import { Young_Serif } from 'next/font/google'
import { Lexend } from 'next/font/google'

const youngSerif = Young_Serif({ subsets: ['latin'], weight: '400' })
const lexend = Lexend({ subsets: ['latin'], weight: '500' })

export default function Navbar() {
  return (
    <div className='fixed top-0 left-0 w-full bg-black z-50'>
      <nav className='max-w-[70%] mx-auto text-white px-6 py-4 flex items-center justify-between'>
        <div>
          <a href='/' className={youngSerif.className} style={{ fontSize: '28px', color: 'white', letterSpacing: '-0.1em', lineHeight: '1' }}>
            garopabasurf
          </a>
        </div>
        <ul className='flex gap-2'>
          <li><a href='/' className={lexend.className + ' px-4 py-2 rounded-[10px] hover:bg-white hover:text-black transition block'} style={{ fontSize: '14px' }}>Principal</a></li>
          <li><a href='/garopaba' className={lexend.className + ' px-4 py-2 rounded-[10px] hover:bg-white hover:text-black transition block'} style={{ fontSize: '14px' }}>Garopaba</a></li>
          <li><a href='/praias' className={lexend.className + ' px-4 py-2 rounded-[10px] hover:bg-white hover:text-black transition block'} style={{ fontSize: '14px' }}>Praias</a></li>
          <li><a href='/noticias' className={lexend.className + ' px-4 py-2 rounded-[10px] hover:bg-white hover:text-black transition block'} style={{ fontSize: '14px' }}>Noticias</a></li>
          <li><a href='/fale-conosco' className={lexend.className + ' px-4 py-2 rounded-[10px] hover:bg-white hover:text-black transition block'} style={{ fontSize: '14px' }}>Fale conosco</a></li>
        </ul>
      </nav>
    </div>
  )
}
