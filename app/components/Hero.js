'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Young_Serif, Lexend } from 'next/font/google'
import Image from 'next/image'

const youngSerif = Young_Serif({ subsets: ['latin'], weight: '400' })
const lexend = Lexend({ subsets: ['latin'], weight: '700' })

export default function Hero() {
  const [busca, setBusca] = useState('')
  const router = useRouter()

  function handleBusca() {
    if (busca.trim()) {
      router.push('/busca?q=' + encodeURIComponent(busca.trim()))
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleBusca()
  }

  return (
    <section className='w-full relative flex items-center justify-center' style={{ height: '500px', marginTop: '57px' }}>
      <Image
        src='/garopabasurf_topo.jpg'
        alt='hero'
        fill
        className='object-cover'
        style={{ filter: 'grayscale(100%)', zIndex: 0 }}
      />
      <div className='absolute inset-0 bg-black/50' style={{ zIndex: 1 }} />
      <div className='relative flex flex-col items-center gap-2 w-[88%] md:w-[50%]' style={{ zIndex: 2 }}>
        <div className='relative w-full flex flex-col md:flex-row gap-2'>
          <input
            type='text'
            placeholder='Buscar praia...'
            value={busca}
            onChange={function(e) { setBusca(e.target.value) }}
            onKeyDown={handleKeyDown}
            className={lexend.className + ' flex-1 px-6 py-4 rounded-2xl text-black bg-white/90 backdrop-blur-sm text-base outline-none shadow-lg'}
            style={{ letterSpacing: '-0.04em' }}
          />
          <button
            onClick={handleBusca}
            className={lexend.className + ' w-full md:w-auto px-6 py-4 bg-white/90 rounded-2xl text-black shadow-lg hover:bg-white transition'}
            style={{ letterSpacing: '-0.04em', fontWeight: '700' }}
          >
            Buscar
          </button>
        </div>
      </div>
    </section>
  )
}
