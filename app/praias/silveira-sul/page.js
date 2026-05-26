'use client'
import { Lexend } from 'next/font/google'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useEffect, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts'

const lexend = Lexend({ subsets: ['latin'], weight: '700' })
const lexendNormal = Lexend({ subsets: ['latin'], weight: '400' })

const LAT = -28.044987
const LON = -48.607301
const MAPS_URL = 'https://www.google.com/maps/dir/?api=1&destination=-28.044987,-48.607301'
const MAPA_EMBED = 'https://www.openstreetmap.org/export/embed.html?bbox=-48.6173,-28.0499,-48.5973,-28.0399&layer=cyclemap&marker=-28.044987,-48.607301'

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
  const abrev = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
  const d = new Date()
  d.setDate(d.getDate() + offset)
  const label = offset === 0 ? 'Hoje' : offset === 1 ? 'Amanhã' : dias[d.getDay()]
  const abreviado = offset === 0 ? 'Hoje' : offset === 1 ? 'Amanhã' : abrev[d.getDay()] + ' ' + d.getDate()
  return { label, abreviado, data: d.getDate() + '/' + (d.getMonth()+1) }
}

function GraficoComDias({ titulo, dados, dataKey, cor, unidade, diasInfo }) {
  const referencias = diasInfo.map(function(d, i) {
    return { x: i * 12, label: d.abreviado, min: d.min, max: d.max }
  })
  return (
    <div className='mb-10'>
      <p className={lexend.className} style={{ fontSize: '14px', color: 'black', letterSpacing: '-0.04em', marginBottom: '8px' }}>{titulo}</p>
      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: '900px' }}>
          <div className='flex border-b border-gray-100 mb-2'>
            {referencias.map(function(r, i) {
              return (
                <div key={i} style={{ flex: 1, borderRight: '1px solid #f0f0f0', padding: '6px 8px' }}>
                  <p style={{ fontSize: '10px', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase' }}>{r.label}</p>
                  <p style={{ fontSize: '11px', color: '#374151', fontWeight: '600' }}>{r.min}→{r.max}{unidade}</p>
                </div>
              )
            })}
          </div>
          <ResponsiveContainer width='100%' height={160}>
            <AreaChart data={dados} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={'grad' + dataKey} x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor={cor} stopOpacity={0.8}/>
                  <stop offset='95%' stopColor={cor} stopOpacity={0.6}/>
                </linearGradient>
              </defs>
              {referencias.map(function(r, i) {
                return i > 0 ? <ReferenceLine key={i} x={r.x} stroke='#e5e7eb' /> : null
              })}
              <XAxis dataKey='hora' tick={{ fontSize: 9, fill: '#9ca3af' }} interval={5} />
              <YAxis tick={{ fontSize: 9, fill: '#9ca3af' }} unit={unidade} width={38} />
              <Tooltip formatter={function(v) { return [v + unidade] }} />
              <Area type='monotone' dataKey={dataKey} stroke={cor} strokeWidth={1.5} fill={'url(#grad' + dataKey + ')'} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

function CardDia({ i, alturaMax, dados, dadosMeteo, tempAgua }) {
  const [expandido, setExpandido] = useState(false)
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
  const horariosDetalhados = [0, 3, 6, 9, 12, 15, 18, 21].map(function(h) {
    const idx = horaBase + h
    return {
      hora: h + 'h',
      altura: fmt(dados.hourly.wave_height[idx], 1),
      periodo: fmt(dados.hourly.wave_period[idx], 0),
      direcao: getDirecao(dados.hourly.wave_direction[idx]),
      swell: fmt(dados.hourly.swell_wave_height[idx], 1),
      vento: dadosMeteo && dadosMeteo.hourly.windspeed_10m[idx] ? fmt(dadosMeteo.hourly.windspeed_10m[idx], 0) + 'km/h' : '-',
      dirVento: dadosMeteo && dadosMeteo.hourly.winddirection_10m[idx] ? getDirecao(dadosMeteo.hourly.winddirection_10m[idx]) : '-',
    }
  })

  return (
    <div className='rounded-2xl border border-gray-100 overflow-hidden'>
      <div className='flex items-center justify-between px-6 py-4 border-b border-gray-100' style={{ backgroundColor: s.bg }}>
        <div>
          <div className='flex items-center gap-3'>
            <span className={lexend.className} style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '-0.04em', color: 'black' }}>{label}</span>
            <span className='text-gray-400 text-sm'>{data}</span>
            {tempAgua && <span className='text-sm px-2 py-0.5 rounded-full bg-white text-blue-500 font-medium'>Temperatura da Água: {tempAgua}°C</span>}
          </div>
          <div className='flex items-center gap-3 mt-1'>
            <span className={lexend.className} style={{ fontSize: '22px', color: 'black', letterSpacing: '-0.04em' }}>{fmt(alturaMax, 1)}m</span>
            <span className='text-sm font-bold px-3 py-1 rounded-full' style={{ color: s.color, backgroundColor: 'white' }}>{s.label}</span>
            <span className='text-gray-400 text-sm'>Direção: {getDirecao(dados.daily.wave_direction_dominant[i])} · Período: {fmt(dados.daily.wave_period_max[i], 0)}s</span>
          </div>
        </div>
      </div>

      {!expandido && (
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
      )}

      {expandido && (
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b border-gray-100'>
                <th className='px-4 py-3 text-left text-gray-400 text-xs font-medium'>Hora</th>
                <th className='px-4 py-3 text-left text-gray-400 text-xs font-medium'>Altura</th>
                <th className='px-4 py-3 text-left text-gray-400 text-xs font-medium'>Direção</th>
                <th className='px-4 py-3 text-left text-gray-400 text-xs font-medium'>Período</th>
                <th className='px-4 py-3 text-left text-gray-400 text-xs font-medium'>Swell</th>
                <th className='px-4 py-3 text-left text-gray-400 text-xs font-medium'>Vento</th>
                <th className='px-4 py-3 text-left text-gray-400 text-xs font-medium'>Dir. Vento</th>
              </tr>
            </thead>
            <tbody>
              {horariosDetalhados.map(function(h) {
                return (
                  <tr key={h.hora} className='border-b border-gray-50 hover:bg-gray-50'>
                    <td className='px-4 py-3 text-gray-400 text-xs font-medium'>{h.hora}</td>
                    <td className='px-4 py-3'><span className={lexend.className} style={{ fontSize: '16px', color: 'black', letterSpacing: '-0.03em' }}>{h.altura}m</span></td>
                    <td className='px-4 py-3 text-gray-600 text-sm'>{h.direcao}</td>
                    <td className='px-4 py-3 text-gray-600 text-sm'>{h.periodo}s</td>
                    <td className='px-4 py-3 text-gray-600 text-sm'>{h.swell}m</td>
                    <td className='px-4 py-3 text-gray-600 text-sm'>{h.vento}</td>
                    <td className='px-4 py-3 text-gray-600 text-sm'>{h.dirVento}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={function() { setExpandido(!expandido) }}
        className={lexendNormal.className}
        style={{ width: '100%', padding: '12px', fontSize: '13px', color: '#6b7280', background: '#fafafa', border: 'none', borderTop: '1px solid #f3f4f6', cursor: 'pointer' }}>
        {expandido ? 'Resumir ↑' : 'Ver todos os detalhes ↓'}
      </button>
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
      fetch('https://marine-api.open-meteo.com/v1/marine?latitude=' + LAT + '&longitude=' + LON + '&hourly=wave_height,wave_direction,wave_period,swell_wave_height,ocean_current_velocity,sea_surface_temperature&daily=wave_height_max,wave_direction_dominant,wave_period_max&timezone=America/Sao_Paulo&forecast_days=7').then(function(r) { return r.json() }),
      fetch('https://api.open-meteo.com/v1/forecast?latitude=' + LAT + '&longitude=' + LON + '&hourly=windspeed_10m,winddirection_10m&timezone=America/Sao_Paulo&forecast_days=7').then(function(r) { return r.json() }),
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
      hora: hora ? hora.slice(11, 16) : '',
      ondas: h ? parseFloat(parseFloat(h).toFixed(2)) : 0,
      vento: dadosMeteo.hourly.windspeed_10m[i] ? parseFloat(parseFloat(dadosMeteo.hourly.windspeed_10m[i]).toFixed(1)) : 0,
      energia: energia,
      mare: dados.hourly.ocean_current_velocity && dados.hourly.ocean_current_velocity[i] ? parseFloat(parseFloat(dados.hourly.ocean_current_velocity[i]).toFixed(2)) : 0,
    }
  }) : []

  const diasInfo = dados ? dados.daily.wave_height_max.map(function(max, i) {
    const { abreviado } = getDiaSemana(i)
    const horaBase = i * 24
    const min = dados.hourly.wave_height[horaBase + 18] ? parseFloat(dados.hourly.wave_height[horaBase + 18].toFixed(1)) : 0
    return { abreviado, min: parseFloat(max ? max.toFixed(1) : 0), max: min }
  }) : []

  const diasInfoVento = dadosMeteo ? dadosMeteo.hourly.windspeed_10m.reduce(function(acc, v, i) {
    const dia = Math.floor(i / 24)
    if (!acc[dia]) acc[dia] = { min: v, max: v, abreviado: getDiaSemana(dia).abreviado }
    if (v < acc[dia].min) acc[dia].min = v
    if (v > acc[dia].max) acc[dia].max = v
    return acc
  }, []).map(function(d) { return { abreviado: d.abreviado, min: parseFloat(d.min.toFixed(0)), max: parseFloat(d.max.toFixed(0)) } }) : []

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
              const tempAgua = dados.hourly.sea_surface_temperature && dados.hourly.sea_surface_temperature[i * 24 + 12]
                ? fmt(dados.hourly.sea_surface_temperature[i * 24 + 12], 1)
                : null
              return (
                <CardDia key={i} i={i} alturaMax={alturaMax} dados={dados} dadosMeteo={dadosMeteo} tempAgua={tempAgua} />
              )
            })}
          </div>
        )}

        {!loading && dados && aba === 'graficos' && (
          <div>
            <GraficoComDias titulo='Ondas' dados={dadosGrafico} dataKey='ondas' cor='#0d9488' unidade='m' diasInfo={diasInfo} />
            <GraficoComDias titulo='Vento' dados={dadosGrafico} dataKey='vento' cor='#06b6d4' unidade='km/h' diasInfo={diasInfoVento} />
            <GraficoComDias titulo='Energia das Ondas' dados={dadosGrafico} dataKey='energia' cor='#f59e0b' unidade='J' diasInfo={diasInfo} />
            <GraficoComDias titulo='Marés' dados={dadosGrafico} dataKey='mare' cor='#0d9488' unidade='m/s' diasInfo={diasInfo} />
          </div>
        )}

        {aba === 'mapa' && (
          <div>
            <div className='flex justify-end mb-3'>
              <a
                href={MAPS_URL}
                target='_blank'
                rel='noreferrer'
                className={lexendNormal.className}
                style={{ padding: '10px 20px', background: 'black', color: 'white', borderRadius: '10px', fontSize: '14px', textDecoration: 'none' }}
              >
                Como chegar
              </a>
            </div>
            <div className='rounded-2xl overflow-hidden' style={{ height: '500px' }}>
              <iframe
                src={MAPA_EMBED}
                width='100%'
                height='100%'
                style={{ border: 0 }}
                allowFullScreen
                loading='lazy'
              />
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
