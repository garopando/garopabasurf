'use client'
import { Lexend } from 'next/font/google'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useEffect, useState } from 'react'

const lexend = Lexend({ subsets: ['latin'], weight: '700' })
const lexendLight = Lexend({ subsets: ['latin'], weight: '400' })

const LAT = -28.1850
const LON = -48.6150

function getStatus(h) {
  if (h < 0.5) return { label: 'Fraco', color: '#9ca3af', bg: '#f3f4f6' }
  if (h < 1.0) return { label: 'Regular', color: '#f59e0b', bg: '#fffbeb' }
  if (h < 1.8) return { label: 'Bom', color: '#22c55e', bg: '#f0fdf4' }
  if (h < 2.5) return { label: 'Otimo', color: '#3b82f6', bg: '#eff6ff' }
  return { label: 'Excelente', color: '#8b5cf6', bg: '#f5f3ff' }
}

function getDirecao(graus) {
  const dirs = ['N','NNE','NE','ENE','L','ESE','SE','SSE','S','SSO','SO','OSO','O','ONO','NO','NNO']
  return dirs[Math.round(graus / 22.5) % 16]
}

function getDiaSemana(offset) {
  const dias = ['Domingo','Segunda-feira','Terca-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sabado']
  const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
  const d = new Date()
  d.setDate(d.getDate() + offset)
  const label = offset === 0 ? 'Hoje' : offset === 1 ? 'Amanha' : dias[d.getDay()]
  return { label, data: d.getDate() + '/' + (d.getMonth()+1) }
}

export default function SilveiraSul() {
  const [dados, setDados] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(function() {
    fetch('https://marine-api.open-meteo.com/v1/marine?latitude=' + LAT + '&longitude=' + LON + '&hourly=wave_height,wave_direction,wave_period,wind_wave_height,swell_wave_height,swell_wave_direction,swell_wave_period&daily=wave_height_max,wave_direction_dominant,wave_period_max&timezone=America/Sao_Paulo&forecast_days=7')
      .then(function(r) { return r.json() })
      .then(function(data) { setDados(data); setLoading(false) })
  }, [])

  return (
    <div className='min-h-screen bg-white'>
      <Navbar />
      <div className='max-w-[70%] mx-auto pt-28 pb-16'>
        <a href='/praias' className='text-gray-400 text-sm hover:text-black transition mb-6 block'>← Voltar para Praias</a>
        <h1 className={lexend.className} style={{ fontSize: '40px', fontWeight: '700', letterSpacing: '-0.06em', color: 'black', WebkitTextStroke: '0.5px black', marginBottom: '4px' }}>Silveira Sul</h1>
        <p className='text-gray-500 text-sm mb-10'>Garopaba, Santa Catarina</p>

        {loading && (
          <div className='flex items-center gap-3 text-gray-400 py-20 justify-center'>
            <div className='w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin' />
            Carregando previsao...
          </div>
        )}

        {!loading && dados && (
          <div className='flex flex-col gap-4'>
            {dados.daily.wave_height_max.map(function(alturaMax, i) {
              const s = getStatus(alturaMax)
              const { label, data } = getDiaSemana(i)
              const horaBase = i * 24
              const horarios = [6, 9, 12, 15, 18].map(function(h) {
                const idx = horaBase + h
                return {
                  hora: h + 'h',
                  altura: dados.hourly.wave_height[idx] ? dados.hourly.wave_height[idx].toFixed(1) : '-',
                  periodo: dados.hourly.wave_period[idx] ? dados.hourly.wave_period[idx].toFixed(0) : '-',
                  direcao: dados.hourly.wave_direction[idx] ? getDirecao(dados.hourly.wave_direction[idx]) : '-',
                  swell: dados.hourly.swell_wave_height[idx] ? dados.hourly.swell_wave_height[idx].toFixed(1) : '-',
                }
              })

              return (
                <div key={i} className='rounded-2xl border border-gray-100 overflow-hidden'>
                  <div className='flex items-center gap-4 px-6 py-4 border-b border-gray-100' style={{ backgroundColor: s.bg }}>
                    <div>
                      <span className='text-gray-400 text-xs'>{label} · {data}</span>
                      <div className='flex items-center gap-3 mt-1'>
                        <span className={lexend.className} style={{ fontSize: '22px', color: 'black', letterSpacing: '-0.04em' }}>
                          {alturaMax.toFixed(1)}m
                        </span>
                        <span className='text-sm font-bold px-3 py-1 rounded-full' style={{ color: s.color, backgroundColor: 'white' }}>{s.label}</span>
                        <span className='text-gray-400 text-sm'>{getDirecao(dados.daily.wave_direction_dominant[i])} · {dados.daily.wave_period_max[i].toFixed(0)}s</span>
                      </div>
                    </div>
                  </div>
                  <div className='grid grid-cols-5 divide-x divide-gray-100'>
                    {horarios.map(function(h) {
                      return (
                        <div key={h.hora} className='p-4 flex flex-col gap-2'>
                          <span className='text-gray-400 text-xs font-medium'>{h.hora}</span>
                          <span className={lexend.className} style={{ fontSize: '20px', color: 'black', letterSpacing: '-0.04em' }}>{h.altura}m</span>
                          <div className='flex flex-col gap-1 mt-1'>
                            <span className='text-gray-500 text-xs'>Dir: {h.direcao}</span>
                            <span className='text-gray-500 text-xs'>Per: {h.periodo}s</span>
                            <span className='text-gray-500 text-xs'>Swell: {h.swell}m</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
