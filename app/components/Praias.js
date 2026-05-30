'use client'
import { Lexend } from 'next/font/google'
import { useEffect, useState } from 'react'

const lexend = Lexend({ subsets: ['latin'], weight: '500' })

const praias = [
  { nome: 'Silveira Sul', slug: 'silveira-sul', lat: -28.044575, lon: -48.608818 },
  { nome: 'Silveira Norte', slug: 'silveira-norte', lat: -28.035384, lon: -48.603403 },
  { nome: 'Ferrugem Norte', slug: 'ferrugem-norte', lat: -28.075091, lon: -48.624343 },
  { nome: 'Siriu Meio', slug: 'siriu-meio', lat: -27.990017, lon: -48.630352 },
  { nome: 'Praia Central', slug: 'central', lat: -28.017217, lon: -48.624413 },
]

function corOnda(alturaM) {
  if (alturaM == null) return '#e5e7eb'
  if (alturaM >= 0.8 && alturaM <= 2.5) return '#22c55e'
  if (alturaM >= 0.5) return '#eab308'
  return '#ef4444'
}

const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']

export default function Praias() {
  const [dados, setDados] = useState({})
  const [dias, setDias] = useState([])

  useEffect(function() {
    praias.forEach(function(p) {
      const url = 'https://marine-api.open-meteo.com/v1/marine?latitude=' + p.lat + '&longitude=' + p.lon + '&daily=wave_height_max&forecast_days=5&timezone=America/Sao_Paulo'
      fetch(url).then(function(r){return r.json()}).then(function(res) {
        if (res && res.daily && res.daily.time) {
          if (dias.length === 0) {
            const ds = res.daily.time.map(function(t) {
              const d = new Date(t + 'T12:00:00')
              return { dia: diasSemana[d.getDay()], num: d.getDate() }
            })
            setDias(ds)
          }
          setDados(function(prev) {
            const novo = Object.assign({}, prev)
            novo[p.slug] = res.daily.wave_height_max
            return novo
          })
        }
      }).catch(function(){})
    })
  }, [])

  function Tabela() {
    return (
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: '160px repeat(5, 1fr)', alignItems: 'center', marginBottom: '8px' }}>
          <div />
          {dias.map(function(d, i) {
            return (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '13px', color: '#9ca3af', fontWeight: '600' }}>{d.dia}</div>
                <div style={{ fontSize: '15px', color: '#111', fontWeight: '700' }}>{d.num}</div>
              </div>
            )
          })}
        </div>
        {praias.map(function(p) {
          const vals = dados[p.slug] || []
          return (
            <a key={p.slug} href={'/praias/' + p.slug} style={{ textDecoration: 'none', display: 'grid', gridTemplateColumns: '160px repeat(5, 1fr)', alignItems: 'center', padding: '14px 0', borderTop: '1px solid #f3f4f6' }}>
              <div className={lexend.className} style={{ fontSize: '16px', color: '#111', fontWeight: '500', letterSpacing: '-0.03em' }}>{p.nome}</div>
              {[0,1,2,3,4].map(function(i) {
                const v = vals[i]
                return (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#111', marginBottom: '6px' }}>{v != null ? v.toFixed(1) + 'm' : '--'}</div>
                    <div style={{ display: 'flex', gap: '2px', justifyContent: 'center' }}>
                      {[0,1,2].map(function(j) {
                        return <span key={j} style={{ width: '14px', height: '4px', borderRadius: '2px', background: corOnda(v) }} />
                      })}
                    </div>
                  </div>
                )
              })}
            </a>
          )
        })}
      </div>
    )
  }

  return (
    <section className='w-full py-12 bg-white'>
      <div className='max-w-[70%] mx-auto hidden md:block'>
        <div className='flex items-center justify-between mb-8'>
          <h2 className={lexend.className} style={{ fontSize: '28px', color: 'black', letterSpacing: '-0.06em', WebkitTextStroke: '0.5px black' }}>Surf Spots Garopaba</h2>
          <a href='/praias' className='px-5 py-2 bg-black text-white border border-black rounded-[10px] text-sm font-medium hover:bg-white hover:text-black transition'>Ver todas</a>
        </div>
        <Tabela />
      </div>
      <div className='md:hidden px-4'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className={lexend.className} style={{ fontSize: '22px', color: 'black', letterSpacing: '-0.06em', WebkitTextStroke: '0.5px black' }}>Surf Spots Garopaba</h2>
          <a href='/praias' className='px-4 py-2 bg-black text-white rounded-[10px] text-xs font-medium' style={{ textDecoration: 'none' }}>Ver todas</a>
        </div>
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <div style={{ minWidth: '520px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '110px repeat(5, 1fr)', alignItems: 'center', marginBottom: '8px' }}>
              <div />
              {dias.map(function(d, i) {
                return (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '600' }}>{d.dia}</div>
                    <div style={{ fontSize: '14px', color: '#111', fontWeight: '700' }}>{d.num}</div>
                  </div>
                )
              })}
            </div>
            {praias.map(function(p) {
              const vals = dados[p.slug] || []
              return (
                <a key={p.slug} href={'/praias/' + p.slug} style={{ textDecoration: 'none', display: 'grid', gridTemplateColumns: '110px repeat(5, 1fr)', alignItems: 'center', padding: '12px 0', borderTop: '1px solid #f3f4f6' }}>
                  <div className={lexend.className} style={{ fontSize: '14px', color: '#111', fontWeight: '500', letterSpacing: '-0.03em' }}>{p.nome}</div>
                  {[0,1,2,3,4].map(function(i) {
                    const v = vals[i]
                    return (
                      <div key={i} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#111', marginBottom: '5px' }}>{v != null ? v.toFixed(1) + 'm' : '--'}</div>
                        <div style={{ display: 'flex', gap: '2px', justifyContent: 'center' }}>
                          {[0,1,2].map(function(j) {
                            return <span key={j} style={{ width: '10px', height: '4px', borderRadius: '2px', background: corOnda(v) }} />
                          })}
                        </div>
                      </div>
                    )
                  })}
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
