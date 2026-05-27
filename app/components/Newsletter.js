'use client'
import { Lexend } from 'next/font/google'
import { useState } from 'react'

const lexend = Lexend({ subsets: ['latin'], weight: '700' })

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!email) return
    setStatus('enviando')
    setTimeout(function() {
      setStatus('sucesso')
      setEmail('')
    }, 1000)
  }

  return (
    <section className='w-full py-16 bg-gray-100'>
      <div className='max-w-[70%] mx-auto hidden md:flex items-center justify-between gap-12'>
        <div className='flex flex-col gap-2'>
          <span className='text-gray-400 text-xs uppercase tracking-widest font-medium'>Newsletter</span>
          <h2 className={lexend.className} style={{ fontSize: '32px', letterSpacing: '-0.06em', lineHeight: '1.1', color: 'black', WebkitTextStroke: '0.5px black' }}>Fique por dentro<br />das ondas de Garopaba.</h2>
          <p className='text-gray-500 text-sm mt-1'>Previsões, notícias e muito mais direto no seu email.</p>
        </div>
        <div className='flex flex-col gap-3 w-full max-w-md'>
          {status === 'sucesso' ? (
            <div className='bg-green-50 border border-green-200 rounded-xl px-6 py-4 text-green-700 text-sm font-medium'>
              Obrigado! Você foi cadastrado com sucesso.
            </div>
          ) : (
            <div className='flex gap-3'>
              <input
                type='email'
                placeholder='seu@email.com'
                value={email}
                onChange={function(e) { setEmail(e.target.value) }}
                className='flex-1 px-5 py-3 rounded-xl text-black bg-white text-sm outline-none border border-gray-300 focus:border-black transition'
              />
              <button
                onClick={handleSubmit}
                disabled={status === 'enviando'}
                className='bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition text-sm whitespace-nowrap'
              >
                {status === 'enviando' ? '...' : 'Inscrever-se'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className='md:hidden px-4'>
        <span className='text-gray-400 text-xs uppercase tracking-widest font-medium'>Newsletter</span>
        <h2 className={lexend.className} style={{ fontSize: '28px', letterSpacing: '-0.06em', lineHeight: '1.1', color: 'black', marginTop: '8px', marginBottom: '8px' }}>Fique por dentro das ondas de Garopaba.</h2>
        <p className='text-gray-500 text-sm mb-4'>Previsões, notícias e muito mais direto no seu email.</p>
        {status === 'sucesso' ? (
          <div className='bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-green-700 text-sm font-medium'>
            Obrigado! Você foi cadastrado com sucesso.
          </div>
        ) : (
          <>
            <input
              type='email'
              placeholder='seu@email.com'
              value={email}
              onChange={function(e) { setEmail(e.target.value) }}
              className='w-full px-5 py-3 rounded-xl text-black bg-white text-sm outline-none border border-gray-300 mb-3'
            />
            <button
              onClick={handleSubmit}
              disabled={status === 'enviando'}
              className='w-full bg-black text-white px-6 py-3 rounded-xl font-bold text-sm'
            >
              {status === 'enviando' ? '...' : 'Inscrever-se'}
            </button>
          </>
        )}
      </div>
    </section>
  )
}
