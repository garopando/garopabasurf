'use client'
import { Lexend } from 'next/font/google'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useEffect, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const lexend = Lexend({ subsets: ['latin'], weight: '700' })
const lexendNormal = Lexend({ subsets: ['latin'], weight: '400' })

const LAT = -28.1850
const LON = -48.6150

function getStatus(h) {
  if (!h || h < 0.5) return { label: 'Fraco', color: '#9ca3af', bg: '#f3f4f6' }
  if (h < 1.0) return { label: 'Regular', color: '#f59e0b', bg: '#fffbeb' }
  if (h < 1.8) return { label: 'Bom', color: '#22c55e', bg: '#f0fdf4' }
  if (h < 2.5) return { label: 'Ótimo', color: '#3b82f6', bg: '#eff6ff' }
  return { label: 'Excelente', color: '#8b5cf6', bg: '#f5f3ff' }
}

function getDirecao(graus) {
  if (graus === null || graus === undefined) return '-'
  const dirs = ['N','NNE','NE','ENE','L','ESE','SE','SSE','S','SSO','SO','OSO','O','ONO','NO','NNO']
  return dirs[Math.round(graus / 22.5) % 16]
}

function fmt(val, dec) {
  if (val === null || val === undefined) return '-'
  return parseFloat(val).toFixed(dec)
}

function getDiaSemana(offset) {
  const dias = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado']
  const d = new Date()
  d.setDate(d.getDate() + offset)
  const label = offset === 0 ? 'Hoje' : offset === 1 ? 'Amanhã' : dias[d.getDay()]
  return { label, data: d.getDate() + '/' + (d.getMonth()+1) }
}

function GraficoSecao({ titulo, dados, dataKey, cor, unidade }) {
  return (
    <div>
      <h2 className={lexend.className} style={{ fontSize: '16px', color: 'black', letterSpacing: '-0.04em', marginBottom: '16px' }}>{titulo}</h2>
      <ResponsiveContainer width='100%' height={220}>
        <AreaChart data={dados}>
          <defs>
            <linearGradient id={'color' + dataKey} x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor={cor} stopOpacity={0.3}/>
              <stop offset='95%' stopColor={cor} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
          <XAxis dataKey='hora' tick={{ fontSize: 10, fill: '#9ca3af' }} interval={11} />
          <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} unit={unidade} width={45} />
          <Tooltip formatter={function(v) { return [v + unidade] }} />
          <Area type='monotone' dataKey={dataKey} stroke={cor} strokeWidth={2} fill={'url(#color' + dataKey + ')'} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function SilveiraSul() {
  const [dados, setDados] = useState(null)
  const [dadosMeteo, setDadosMeteo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [aba, setAba] = useState('resumo')

  useEffect(function() {
    Promise.all([
      fetch('https://marine-api.open-meteo.com/v1/marine?latitude=' + LAT + '&longitude=' + LON + '&hourly=wave_height,wave_direction,wave_period,swell_wave_height&daily=wave_height_max,wave_direction_dominant,wave_period_max&timezone=America/Sao_Paulo&forecast_days=16').then(function(r) { return r.json() }),
      fetch('https://api.open-meteo.com/v1/forecast?latitude=' + LAT + '&longitude=' + LON + '&hourly=windspeed_10m,winddirection_10m&timezone=America/Sao_Paulo&forecast_days=16').then(function(r) { return r.json() }),
    ]).then(function(results) {
      setDados(results[0])
      setDadosMeteo(results[1])
      setLoading(false)
    }).catch(function() { setLoading(false) })
  }, [])

  const dadosGrafico = dados && dadosMeteo ? dados.hourly.wave_height.map(function(h, i) {
    const hora = dados.hourly.time[i]
    const periodo = dados.hourly.wave_period[i]
    const energia = h && periodo ? Math.round(h * h * periodo * 500) : 0
    return {
      hora: hora ? hora.slice(5, 16).replace('T', ' ') : '',
      ondas: h ? parseFloat(parseFloat(h).toFixed(2)) : 0,
      swell: dados.hourly.swell_wave_height[i] ? parseFloat(parseFloat(dados.hourly.swell_wave_height[i]).toFixed(2)) : 0,
      vento: dadosMeteo.hourly.windspeed_10m[i] ? parseFloat(parseFloat(dadosMeteo.hourly.windspeed_10m[i]).toFixed(1)) : 0,
      energia: energia,
    }
  }).filter(function(_, i) { return i % 2 === 0 }) : []

  return (
    <div className='min-h-screen bg-white'>
      <Navbar />
      <div className='max-w-[70%] mx-auto pt-28 pb-16'>
        <a href='/praias' className='text-gray-400 text-sm hover:text-black transition mb-6 block'>← Voltar para Praias</a>
        <h1 className={lexend.className} style={{ fontSize: '40px', fontWeight: '700', letterSpacing: '-0.06em', color: 'black', WebkitTextStroke: '0.5px black', marginBottom: '4px' }}>Silveira Sul</h1>
        <p className='text-gray-500 text-sm mb-8'>Garopaba, Santa Catarina</p>

        <div className='flex border-b border-gray-200 mb-8'>
          {['resumo', 'graficos', 'mapa'].map(function(a) {
            return (
              <button key={a} onClick={function() { setAba(a) }}
                className={lexendNormal.className}
                style={{ padding: '10px 24px', fontSize: '14px', color: aba === a ? 'black' : '#9ca3af', borderBottom: aba === a ? '2px solid black' : '2px solid transparent', background: 'none', cursor: 'pointer', fontWeight: aba === a ? '700' : '400', marginBottom: '-1px' }}>
                {a === 'resumo' ? 'Resumo' : a === 'graficos' ? 'Gráficos' : 'Mapa'}
              </button>
            )
          })}
        </div>

        {loading && (
          <div className='flex items-center gap-3 text-gray-400 py-20 justify-center'>
            <div className='w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin' />
            Carregando previsão...
          </div>
        )}

        {!loading && dados && aba === 'resumo' && (
          <div className='flex flex-col gap-4'>
            {dados.daily.wave_height_max.map(function(alturaMax, i) {
              const s = getStatus(alturaMax)
              const { label, data } = getDiaSemana(i)
              const horaBase = i * 24
              const horarios = [6, 9, 12, 15, 18].map(function(h) {
                const idx = horaBase + h
                return {
                  hora: h + 'h',
                  altura: fmt(dados.hourly.wave_height[idx], 1),
                  periodo: fmt(dados.hourly.wave_period[idx], 0),
                  direcao: getDirecao(dados.hourly.wave_direction[idx]),
                  swell: fmt(dados.hourly.swell_wave_height[idx], 1),
                  vento: dadosMeteo && dadosMeteo.hourly.windspeed_10m[idx] ? fmt(dadosMeteo.hourly.windspeed_10m[idx], 0) + 'km/h' : '-',
                }
              })
              return (
                <div key={i} className='rounded-2xl border border-gray-100 overflow-hidden'>
                  <div className='flex items-center gap-4 px-6 py-4 border-b border-gray-100' style={{ backgroundColor: s.bg }}>
                    <div>
                      <div className='flex items-center gap-3'>
                        <span className={lexend.className} style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '-0.04em', color: 'black' }}>{label}</span>
                        <span className='text-gray-400 text-sm'>{data}</span>
                      </div>
                      <div className='flex items-center gap-3 mt-1'>
                        <span className={lexend.className} style={{ fontSize: '22px', color: 'black', letterSpacing: '-0.04em' }}>{fmt(alturaMax, 1)}m</span>
                        <span className='text-sm font-bold px-3 py-1 rounded-full' style={{ color: s.color, backgroundColor: 'white' }}>{s.label}</span>
                        <span className='text-gray-400 text-sm'>Direção: {getDirecao(dados.daily.wave_direction_dominant[i])} · Período: {fmt(dados.daily.wave_period_max[i], 0)}s</span>
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
                            <span className='text-gray-500 text-xs'>Direção: {h.direcao}</span>
                            <span className='text-gray-500 text-xs'>Período: {h.periodo}s</span>
                            <span className='text-gray-500 text-xs'>Swell: {h.swell}m</span>
                            <span className='text-gray-500 text-xs'>Vento: {h.vento}</span>
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

        {!loading && dados && aba === 'graficos' && (
          <div className='flex flex-col gap-10'>
            <GraficoSecao titulo='Ondas' dados={dadosGrafico} dataKey='ondas' cor='#0d9488' unidade='m' />
            <GraficoSecao titulo='Vento' dados={dadosGrafico} dataKey='vento' cor='#06b6d4' unidade='km/h' />
            <GraficoSecao titulo='Energia das Ondas' dados={dadosGrafico} dataKey='energia' cor='#f59e0b' unidade='J' />
          </div>
        )}

        {aba === 'mapa' && (
          <div className='rounded-2xl overflow-hidden' style={{ height: '500px' }}>
            <iframe
              src={'https://maps.google.com/maps?q=' + LAT + ',' + LON + '&z=15&output=embed&t=k'}
              width='100%'
              height='100%'
              style={{ border: 0 }}
              allowFullScreen
              loading='lazy'
            />
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
