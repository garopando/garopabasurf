import { Young_Serif } from 'next/font/google'
import { Lexend } from 'next/font/google'

const youngSerif = Young_Serif({ subsets: ['latin'], weight: '400' })
const lexend = Lexend({ subsets: ['latin'], weight: '500' })

export default function Footer() {
  return (
    <>
      <footer className='w-full bg-black text-white py-10 hidden md:block'>
        <div className='max-w-[70%] mx-auto grid grid-cols-3 gap-8'>
          <div className='col-span-1'>
            <h3 className={youngSerif.className} style={{ fontSize: '28px', letterSpacing: '-0.08em', color: 'white', WebkitTextStroke: '0.5px white' }}>garopabasurf</h3>
            <p className='text-gray-400 text-sm leading-relaxed mt-2'>O melhor portal de previsão de ondas de Garopaba e região.</p>
          </div>
          <div>
            <h4 className={lexend.className} style={{ fontSize: '18px', letterSpacing: '-0.06em', color: 'white', marginBottom: '12px' }}>Menu</h4>
            <ul className='flex flex-col gap-2 text-gray-400 text-sm'>
              <li><a href='/' className='hover:text-white transition'>Principal</a></li>
              <li><a href='/garopaba' className='hover:text-white transition'>Garopaba</a></li>
              <li><a href='/praias' className='hover:text-white transition'>Praias</a></li>
              <li><a href='/noticias' className='hover:text-white transition'>Notícias</a></li>
              <li><a href='/fale-conosco' className='hover:text-white transition'>Fale conosco</a></li>
            </ul>
          </div>
          <div>
            <h4 className={lexend.className} style={{ fontSize: '18px', letterSpacing: '-0.06em', color: 'white', marginBottom: '12px' }}>Praias</h4>
            <ul className='flex flex-col gap-2 text-gray-400 text-sm'>
              <li><a href='#' className='hover:text-white transition'>Silveira</a></li>
              <li><a href='#' className='hover:text-white transition'>Ferrugem</a></li>
              <li><a href='#' className='hover:text-white transition'>Siriú</a></li>
              <li><a href='#' className='hover:text-white transition'>Gamboa</a></li>
              <li><a href='#' className='hover:text-white transition'>Barra</a></li>
              <li><a href='#' className='hover:text-white transition'>Central</a></li>
              <li><a href='#' className='hover:text-white transition'>Ouvidor</a></li>
            </ul>
          </div>
          <div>
            <h4 className={lexend.className} style={{ fontSize: '18px', letterSpacing: '-0.06em', color: 'white', marginBottom: '12px' }}>Redes Sociais</h4>
            <ul className='flex flex-col gap-2 text-gray-400 text-sm'>
              <li><a href='https://instagram.com/garopabasurf' target='_blank' className='hover:text-white transition'>Instagram</a></li>
              <li><a href='#' className='hover:text-white transition'>YouTube</a></li>
              <li><a href='#' className='hover:text-white transition'>Facebook</a></li>
            </ul>
          </div>
        </div>
        <div className='max-w-[70%] mx-auto mt-10 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm'>
          2025 GaropabaSurf. Todos os direitos reservados.
        </div>
      </footer>

      <nav className='md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50'>
        <link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200' />
        <div className='flex items-center justify-around py-2'>
          <a href='/' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', textDecoration: 'none', color: '#111', flex: 1 }}>
            <span className='material-symbols-outlined' style={{ fontSize: '24px' }}>waves</span>
            <span style={{ fontSize: '10px', fontFamily: 'sans-serif' }}>Previsão</span>
          </a>
          <a href='/praias' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', textDecoration: 'none', color: '#9ca3af', flex: 1 }}>
            <span className='material-symbols-outlined' style={{ fontSize: '24px' }}>beach_access</span>
            <span style={{ fontSize: '10px', fontFamily: 'sans-serif' }}>Praias</span>
          </a>
          <a href='/noticias' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', textDecoration: 'none', color: '#9ca3af', flex: 1 }}>
            <span className='material-symbols-outlined' style={{ fontSize: '24px' }}>newspaper</span>
            <span style={{ fontSize: '10px', fontFamily: 'sans-serif' }}>Notícias</span>
          </a>
          <a href='#' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', textDecoration: 'none', color: '#9ca3af', flex: 1 }}>
            <span className='material-symbols-outlined' style={{ fontSize: '24px' }}>favorite</span>
            <span style={{ fontSize: '10px', fontFamily: 'sans-serif' }}>Favoritos</span>
          </a>
          <a href='#' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', textDecoration: 'none', color: '#9ca3af', flex: 1 }}>
            <span className='material-symbols-outlined' style={{ fontSize: '24px' }}>person</span>
            <span style={{ fontSize: '10px', fontFamily: 'sans-serif' }}>Perfil</span>
          </a>
        </div>
      </nav>

      <div className='md:hidden' style={{ height: '64px' }} />
    </>
  )
}
