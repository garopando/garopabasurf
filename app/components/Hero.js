import { Young_Serif } from 'next/font/google'
import Image from 'next/image'

const youngSerif = Young_Serif({ subsets: ['latin'], weight: '400' })

export default function Hero() {
  return (
    <section
      className='w-full relative flex items-center justify-center'
      style={{ height: '500px', marginTop: '57px' }}
    >
      <Image
        src='https://www.waves.com.br/wp-content/uploads/2018/10/13-Praia-do-Silveira-foto-Ailton-Souza-photography.jpg'
        alt='hero'
        fill
        className='object-cover'
        style={{ filter: 'grayscale(100%)', zIndex: 0 }}
      />
      <div className='absolute inset-0 bg-black/50' style={{ zIndex: 1 }} />
      <div className='relative flex flex-col items-center gap-2 w-[50%]' style={{ zIndex: 2 }}>
        <input
          type='text'
          placeholder='Buscar praia...'
          className='w-full px-6 py-4 rounded-2xl text-black bg-white/90 backdrop-blur-sm text-base outline-none shadow-lg'
        />
        <p style={{ textAlign: 'center', lineHeight: '1.1', marginTop: '30px' }}>
          <span className={youngSerif.className} style={{ fontSize: '18px', color: 'white', display: 'block', fontWeight: '800', letterSpacing: '-0.04em' }}>
            As melhores ondas de Garopaba,
          </span>
          <span className={youngSerif.className} style={{ fontSize: '36px', color: 'white', display: 'block', fontWeight: '600', fontStyle: 'italic', letterSpacing: '-0.04em' }}>
            em um só lugar.
          </span>
        </p>
      </div>
    </section>
  )
}
