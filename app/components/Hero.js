'use client'
import { useState } from 'react'
import { Young_Serif } from 'next/font/google'
import Image from 'next/image'

const youngSerif = Young_Serif({ subsets: ['latin'], weight: '400' })

const praias = [
  { nome: 'Silveira Sul', slug: 'silveira-sul' },
  { nome: 'Silveira Norte', slug: 'silveira-norte' },
  { nome: 'Ferrugem Norte', slug: 'ferrugem-norte' },
  { nome: 'Ferrugem Sul', slug: 'ferrugem-sul' },
  { nome: 'Barra', slug: 'barra' },
  { nome: 'Siriu Norte', slug: 'siriu-norte' },
  { nome: 'Siriu Meio de Praia', slug: 'siriu-meio' },
  { nome: 'Gamboa', slug: 'gamboa' },
  { nome: 'Ouvidor', slug: 'ouvidor' },
  { nome: 'Praia Central', slug: 'central' },
]

export default function Hero() {
  const [busca, setBusca] = useState('')
  const [aberto, setAberto] = useState(false)

  const filtradas = praias.filter(function(p) {
    return p.nome.toLowerCase().includes(busca.toLowerCase())
  })

  function selecionar(slug) {
    window.location.href = '/praias/' + slug
  }

  return (
    <section className='w-full relative flex items-center justify-center' style={{ height: '500px', marginTop: '57px' }}>
      <Image
        src='https://www.waves.com.br/wp-content/uploads/2018/10/13-Praia-do-Silveira-foto-Ailton-Souza-photography.jpg'
        alt='hero'
        fill
        className='object-cover'
        style={{ filter: 'grayscale(100%)', zIndex: 0 }}
      />
      <div className='absolute inset-0 bg-black/50' style={{ zIndex: 1 }} />
      <div className='relative flex flex-col items-center gap-2 w-[50%]' style={{ zIndex: 2 }}>
        <div className='relative w-full'>
          <input
            type='text'
            placeholder='Buscar praia...'
            value={busca}
            onChange={function(e) { setBusca(e.target.value); setAberto(true) }}
            onFocus={function() { setAberto(true) }}
            onBlur={function() { setTimeout(function() { setAberto(false) }, 150) }}
            className='w-full px-6 py-4 rounded-2xl text-black bg-white/90 backdrop-blur-sm text-base outline-none shadow-lg'
          />
          {aberto && busca.length > 0 && filtradas.length > 0 && (
            <ul className='absolute w-full bg-white rounded-2xl mt-2 shadow-xl overflow-hidden' style={{ zIndex: 10 }}>
              {filtradas.map(function(p) {
                return (
                  <li
                    key={p.slug}
                    onMouseDown={function() { selecionar(p.slug) }}
                    className='px-6 py-3 text-black hover:bg-gray-100 cursor-pointer text-sm border-b border-gray-100 last:border-0'
                  >
                    {p.nome}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
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
