'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Lexend } from 'next/font/google'

const lexend = Lexend({ subsets: ['latin'], weight: '700' })
const meses = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez']

function dataObj(d) { return new Date(d + 'T12:00:00') }
function fmtData(d) {
  const o = dataObj(d)
  return o.getDate() + ' ' + meses[o.getMonth()] + '. ' + o.getFullYear()
}

function Card({ ev }) {
  return (
    <a href='/eventos' style={{ textDecoration: 'none', border: '1px solid #eceef1', borderRadius: '14px', overflow: 'hidden', background: '#fff', display: 'block' }}>
      {ev.thumbnail && <img src={ev.thumbnail} alt={ev.titulo} style={{ width: '100%', height: '150px', objectFit: 'cover', display: 'block' }} />}
      <div style={{ padding: '16px' }}>
        {ev.tipo && <span style={{ fontSize: '11px', fontWeight: '700', color: ev.tipo === 'Campeonato' ? '#0369a1' : '#9333ea', background: ev.tipo === 'Campeonato' ? '#e0f2fe' : '#f3e8ff', padding: '3px 10px', borderRadius: '20px' }}>{ev.tipo}</span>}
        <h3 className={lexend.className} style={{ fontSize: '17px', color: '#111', letterSpacing: '-0.04em', lineHeight: '1.2', margin: '10px 0 8px' }}>{ev.titulo}</h3>
        <p style={{ fontSize: '13px', color: '#6b7280' }}>📅 {fmtData(ev.data_inicio)}{ev.data_fim ? ' até ' + fmtData(ev.data_fim) : ''}</p>
        {ev.local && <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>📍 {ev.local}</p>}
      </div>
    </a>
  )
}

export default function EventosHome() {
  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(function() {
    const hoje = new Date(); hoje.setHours(0,0,0,0)
    const hojeStr = hoje.toISOString().slice(0,10)
    supabase.from('eventos').select('*').eq('publicado', true)
      .or('data_fim.gte.' + hojeStr + ',data_inicio.gte.' + hojeStr)
      .order('data_inicio', { ascending: true }).limit(3)
      .then(function({ data }) {
        setEventos(data || [])
        setLoading(false)
      })
  }, [])

  if (loading || eventos.length === 0) return null

  return (
    <section className='w-full py-10'>
      <div className='max-w-[70%] mx-auto hidden md:block'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className={lexend.className} style={{ fontSize: '28px', color: 'black', letterSpacing: '-0.06em', WebkitTextStroke: '0.5px black' }}>Próximos Eventos</h2>
          <a href='/eventos' className='px-5 py-2 bg-black text-white border border-black rounded-[10px] text-sm font-medium hover:bg-white hover:text-black transition' style={{ textDecoration: 'none' }}>Ver todos</a>
        </div>
        <div className='grid grid-cols-3 gap-4'>
          {eventos.map(function(ev) { return <Card key={ev.id} ev={ev} /> })}
        </div>
      </div>
      <div className='md:hidden px-4 w-full'>
        <div className='flex items-center justify-between mb-4 px-4'>
          <h2 className={lexend.className} style={{ fontSize: '24px', color: 'black', letterSpacing: '-0.06em', WebkitTextStroke: '0.5px black' }}>Próximos Eventos</h2>
          <a href='/eventos' className='px-4 py-2 bg-black text-white rounded-[10px] text-xs font-medium' style={{ textDecoration: 'none' }}>Ver todos</a>
        </div>
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
          {eventos.map(function(ev) {
            const img = ev.thumbnail || 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80'
            return (
              <a key={ev.id} href='/eventos' className='relative overflow-hidden rounded-xl flex items-end cursor-pointer flex-shrink-0'
                style={{ backgroundImage: 'url(' + img + ')', backgroundSize: 'cover', backgroundPosition: 'center', width: '160px', height: '160px', scrollSnapAlign: 'start', textDecoration: 'none' }}>
                <div className='absolute inset-0 bg-black/50' />
                <div className='relative z-10 p-3'>
                  <h3 className={lexend.className} style={{ fontSize: '12px', color: 'white', fontWeight: '500', letterSpacing: '-0.02em', lineHeight: '1.3' }}>{ev.titulo}</h3>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
