'use client'
import { Lexend } from 'next/font/google'
import AvaliacoesPraia from './AvaliacoesPraia'
import Navbar from './Navbar'
import Footer from './Footer'
import { useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import MapaSatelite from './MapaSatelite'
import { AreaChart, Area, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

const lexend = Lexend({ subsets: ['latin'], weight: '700' })
const lexendNormal = Lexend({ subsets: ['latin'], weight: '400' })

function getStatus(h) {
  if (!h || h < 0.5) return { label: 'Fraco', color: '#9ca3af', bg: '#f3f4f6' }
  if (h < 1.0) return { label: 'Regular', color: '#f59e0b', bg: '#fffbeb' }
  if (h < 1.8) return { label: 'Bom', color: '#22c55e', bg: '#f0fdf4' }
  if (h < 2.5) return { label: 'Otimo', color: '#3b82f6', bg: '#eff6ff' }
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
  const dias = ['Domingo','Segunda-feira','Terca-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sabado']
  const abrev = ['Dom','Seg','Ter','Qua','Qui','Sex','Sab']
  const d = new Date()
  d.setDate(d.getDate() + offset)
  const label = offset === 0 ? 'Hoje' : offset === 1 ? 'Amanha' : dias[d.getDay()]
  const abreviado = offset === 0 ? 'Hoje' : offset === 1 ? 'Amanha' : abrev[d.getDay()] + ' ' + d.getDate()
  return { label, abreviado, data: d.getDate() + '/' + (d.getMonth()+1) }
}

function setaSvg(graus, cor, t) {
  return '<svg width="' + t + '" height="' + t + '" viewBox="0 0 24 24" style="transform:rotate(' + (graus + 180) + 'deg);"><path d="M12 2 L18 20 L12 16 L6 20 Z" fill="' + cor + '"/></svg>'
}

function corPorPeriodo(p) {
  if (p >= 13) return '#0d9488'
  if (p >= 11) return '#2cae a3'.replace(' ', '')
  if (p >= 9) return '#5fc4bb'
  if (p >= 7) return '#9bdbd5'
  return '#cdeeeb'
}

function GraficoOndas({ dadosFull, diasInfo }) {
  // 1 barra a cada 3h -> palitos largos
  const dados = (dadosFull || []).filter(function(d, i) { return i % 3 === 0 })
  const referencias = diasInfo.map(function(d, i) {
    return { x: i * 4, label: d.abreviado, min: d.min, max: d.max }
  })
  // amostra de direcao: 1 seta a cada 2 barras (=6h)
  const passoSeta = 2
  return (
    <div className='mb-10'>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <p className={lexend.className} style={{ fontSize: '14px', color: 'black', letterSpacing: '-0.04em' }}>Ondas</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '9px', color: '#9ca3af' }}>período:</span>
          {[['<7s','#cdeeeb'],['7-9s','#9bdbd5'],['9-11s','#5fc4bb'],['11-13s','#2caea3'],['13s+','#0d9488']].map(function(c) {
            return <span key={c[0]} style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '9px', color: '#6b7280' }}><span style={{ width: '10px', height: '10px', borderRadius: '2px', background: c[1], display: 'inline-block' }} />{c[0]}</span>
          })}
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: '600px' }}>
          <div className='flex border-b border-gray-100 mb-2'>
            {referencias.map(function(r, i) {
              return (
                <div key={i} style={{ flex: 1, borderRight: '1px solid #f0f0f0', padding: '4px 6px' }}>
                  <p style={{ fontSize: '9px', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase' }}>{r.label}</p>
                  <p style={{ fontSize: '10px', color: '#374151', fontWeight: '600' }}>{r.min}→{r.max}m</p>
                </div>
              )
            })}
          </div>
          <ResponsiveContainer width='100%' height={140}>
            <BarChart data={dados} margin={{ top: 5, right: 0, left: 0, bottom: 0 }} barCategoryGap={2}>
              {referencias.map(function(r, i) {
                return i > 0 && dados[r.x] ? <ReferenceLine key={i} x={dados[r.x].hora} stroke='#e5e7eb' /> : null
              })}
              <XAxis dataKey='hora' tick={{ fontSize: 8, fill: '#9ca3af' }} interval={3} />
              <YAxis tick={{ fontSize: 8, fill: '#9ca3af' }} unit='m' width={35} />
              <Tooltip formatter={function(v, n, p) { return [v + 'm · ' + (p && p.payload ? p.payload.periodo + 's ' + p.payload.direcao : '')] }} labelFormatter={function(l) { return l }} />
              <Bar dataKey='ondas' radius={[2, 2, 0, 0]}>
                {dados.map(function(d, i) {
                  return <Cell key={i} fill={corPorPeriodo(d.periodo)} />
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {/* setas de direcao */}
          <div style={{ display: 'flex', marginTop: '2px' }}>
            {dados.map(function(d, i) {
              if (i % passoSeta !== 0) return null
              const ang = d.direcao ? null : null
              return (
                <div key={i} style={{ flex: passoSeta, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='#6b7280' strokeWidth='2' style={{ transform: 'rotate(' + (grausDe(d.direcao)) + 'deg)' }}>
                    <line x1='12' y1='19' x2='12' y2='5' /><polyline points='6 11 12 5 18 11' />
                  </svg>
                  <span style={{ fontSize: '8px', color: '#9ca3af', fontWeight: '600' }}>{d.direcao}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// converte rotulo (N, NE, SSE...) em graus pra rotacionar a seta (seta aponta pra ONDE a onda vai)
function grausDe(dir) {
  const mapa = { 'N': 180, 'NNE': 202, 'NE': 225, 'ENE': 247, 'E': 270, 'ESE': 292, 'SE': 315, 'SSE': 337, 'S': 0, 'SSO': 22, 'SO': 45, 'OSO': 67, 'O': 90, 'ONO': 112, 'NO': 135, 'NNO': 157 }
  return mapa[dir] != null ? mapa[dir] : 0
}

function hexParaRgb(h) {
  const n = parseInt(h.replace('#', ''), 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}
function corPorIntensidade(corBase, valor, maximo) {
  const t = maximo > 0 ? Math.max(0, Math.min(1, valor / maximo)) : 0
  // mistura com branco: t baixo -> mais branco (fraco), t alto -> cor cheia (forte)
  const mix = 0.25 + 0.75 * t
  const c = hexParaRgb(corBase)
  const r = Math.round(255 + (c.r - 255) * mix)
  const g = Math.round(255 + (c.g - 255) * mix)
  const b = Math.round(255 + (c.b - 255) * mix)
  return 'rgb(' + r + ',' + g + ',' + b + ')'
}

function GraficoComDias({ titulo, dados, dataKey, cor, unidade, diasInfo }) {
  const dadosAmostra = (dados || []).filter(function(d, i) { return i % 3 === 0 })
  const referencias = diasInfo.map(function(d, i) {
    return { x: i * 4, label: d.abreviado, min: d.min, max: d.max }
  })
  const maxValor = dadosAmostra.reduce(function(m, d) { return d[dataKey] > m ? d[dataKey] : m }, 0)
  return (
    <div className='mb-10'>
      <p className={lexend.className} style={{ fontSize: '14px', color: 'black', letterSpacing: '-0.04em', marginBottom: '8px' }}>{titulo}</p>
      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: '600px' }}>
          <div className='flex border-b border-gray-100 mb-2'>
            {referencias.map(function(r, i) {
              return (
                <div key={i} style={{ flex: 1, borderRight: '1px solid #f0f0f0', padding: '4px 6px' }}>
                  <p style={{ fontSize: '9px', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase' }}>{r.label}</p>
                  <p style={{ fontSize: '10px', color: '#374151', fontWeight: '600' }}>{r.min}→{r.max}{unidade}</p>
                </div>
              )
            })}
          </div>
          <ResponsiveContainer width='100%' height={140}>
            <BarChart data={dadosAmostra} margin={{ top: 5, right: 0, left: 0, bottom: 0 }} barCategoryGap={2}>
              {referencias.map(function(r, i) {
                return i > 0 && dadosAmostra[r.x] ? <ReferenceLine key={i} x={dadosAmostra[r.x].hora} stroke='#e5e7eb' /> : null
              })}
              <XAxis dataKey='hora' tick={{ fontSize: 8, fill: '#9ca3af' }} interval={3} />
              <YAxis tick={{ fontSize: 8, fill: '#9ca3af' }} unit={unidade} width={35} />
              <Tooltip formatter={function(v) { return [v + unidade] }} />
              <Bar dataKey={dataKey} radius={[2, 2, 0, 0]}>
                {dadosAmostra.map(function(d, i) {
                  return <Cell key={i} fill={corPorIntensidade(cor, d[dataKey], maxValor)} />
                })}
              </Bar>
            </BarChart>
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
      vento: dadosMeteo && dadosMeteo.hourly && dadosMeteo.hourly.windspeed_10m[idx] ? fmt(dadosMeteo.hourly.windspeed_10m[idx], 0) + 'km/h' : '-',
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
      vento: dadosMeteo && dadosMeteo.hourly && dadosMeteo.hourly.windspeed_10m[idx] ? fmt(dadosMeteo.hourly.windspeed_10m[idx], 0) + 'km/h' : '-',
      dirVento: dadosMeteo && dadosMeteo.hourly && dadosMeteo.hourly.winddirection_10m[idx] ? getDirecao(dadosMeteo.hourly.winddirection_10m[idx]) : '-',
    }
  })

  return (
    <div className='rounded-2xl border border-gray-100 overflow-hidden'>
      <div className='px-4 py-3 border-b border-gray-100' style={{ backgroundColor: s.bg }}>
        <div className='flex items-center gap-2 mb-1'>
          <span className={lexend.className} style={{ fontSize: '16px', fontWeight: '700', letterSpacing: '-0.04em', color: 'black' }}>{label}</span>
          <span className='text-gray-400 text-xs'>{data}</span>
          {tempAgua && <span className='text-xs px-2 py-0.5 rounded-full bg-white text-blue-500 font-medium'>Agua: {tempAgua}°C</span>}
        </div>
        <div className='flex items-center gap-2'>
          <span className={lexend.className} style={{ fontSize: '20px', color: 'black', letterSpacing: '-0.04em' }}>{fmt(alturaMax, 1)}m</span>
          <span className='text-xs font-bold px-2 py-0.5 rounded-full' style={{ color: s.color, backgroundColor: 'white' }}>{s.label}</span>
          <span className='text-gray-400 text-xs'>{getDirecao(dados.daily.wave_direction_dominant[i])} · {fmt(dados.daily.wave_period_max[i], 0)}s</span>
        </div>
      </div>

      {!expandido && (
        <div style={{ overflowX: 'auto' }}>
          <div style={{ display: 'flex', minWidth: '500px' }}>
            {horarios.map(function(h) {
              return (
                <div key={h.hora} style={{ flex: 1, padding: '12px', borderRight: '1px solid #f3f4f6' }}>
                  <p style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '600', marginBottom: '4px' }}>{h.hora}</p>
                  <p className={lexend.className} style={{ fontSize: '18px', color: 'black', letterSpacing: '-0.03em', marginBottom: '6px' }}>{h.altura}m</p>
                  <p style={{ fontSize: '11px', color: '#6b7280' }}>Dir: {h.direcao}</p>
                  <p style={{ fontSize: '11px', color: '#6b7280' }}>Per: {h.periodo}s</p>
                  <p style={{ fontSize: '11px', color: '#6b7280' }}>Swell: {h.swell}m</p>
                  <p style={{ fontSize: '11px', color: '#6b7280' }}>Vento: {h.vento}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {expandido && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                <th style={{ padding: '8px 12px', textAlign: 'left', color: '#9ca3af', fontWeight: '500' }}>Hora</th>
                <th style={{ padding: '8px 12px', textAlign: 'left', color: '#9ca3af', fontWeight: '500' }}>Altura</th>
                <th style={{ padding: '8px 12px', textAlign: 'left', color: '#9ca3af', fontWeight: '500' }}>Dir.</th>
                <th style={{ padding: '8px 12px', textAlign: 'left', color: '#9ca3af', fontWeight: '500' }}>Per.</th>
                <th style={{ padding: '8px 12px', textAlign: 'left', color: '#9ca3af', fontWeight: '500' }}>Swell</th>
                <th style={{ padding: '8px 12px', textAlign: 'left', color: '#9ca3af', fontWeight: '500' }}>Vento</th>
                <th style={{ padding: '8px 12px', textAlign: 'left', color: '#9ca3af', fontWeight: '500' }}>Dir.V</th>
              </tr>
            </thead>
            <tbody>
              {horariosDetalhados.map(function(h) {
                return (
                  <tr key={h.hora} style={{ borderBottom: '1px solid #f9fafb' }}>
                    <td style={{ padding: '8px 12px', color: '#9ca3af', fontSize: '11px' }}>{h.hora}</td>
                    <td style={{ padding: '8px 12px' }}><span className={lexend.className} style={{ fontSize: '14px', color: 'black' }}>{h.altura}m</span></td>
                    <td style={{ padding: '8px 12px', color: '#4b5563', fontSize: '11px' }}>{h.direcao}</td>
                    <td style={{ padding: '8px 12px', color: '#4b5563', fontSize: '11px' }}>{h.periodo}s</td>
                    <td style={{ padding: '8px 12px', color: '#4b5563', fontSize: '11px' }}>{h.swell}m</td>
                    <td style={{ padding: '8px 12px', color: '#4b5563', fontSize: '11px' }}>{h.vento}</td>
                    <td style={{ padding: '8px 12px', color: '#4b5563', fontSize: '11px' }}>{h.dirVento}</td>
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
        style={{ width: '100%', padding: '10px', fontSize: '12px', color: '#6b7280', background: '#fafafa', border: 'none', borderTop: '1px solid #f3f4f6', cursor: 'pointer' }}>
        {expandido ? 'Resumir ↑' : 'Ver todos os detalhes ↓'}
      </button>
    </div>
  )
}

export default function PraiaForecast({ nome, slug, lat, lon, foto }) {
  const { alternarFavorito, ehFavorito } = useAuth()
  const [dados, setDados] = useState(null)
  const [dadosMeteo, setDadosMeteo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [aba, setAba] = useState('resumo')

  const MAPS_URL = 'https://www.google.com/maps/dir/?api=1&destination=' + lat + ',' + lon

  useEffect(function() {
    Promise.all([
      fetch('https://marine-api.open-meteo.com/v1/marine?latitude=' + lat + '&longitude=' + lon + '&hourly=wave_height,wave_direction,wave_period,swell_wave_height,ocean_current_velocity,sea_surface_temperature&daily=wave_height_max,wave_direction_dominant,wave_period_max&timezone=America/Sao_Paulo&forecast_days=7').then(function(r) { return r.ok ? r.json() : null }).then(function(j) { return j && j.hourly ? j : null }).catch(function() { return null }),
      fetch('https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon + '&hourly=windspeed_10m,winddirection_10m&timezone=America/Sao_Paulo&forecast_days=7').then(function(r) { return r.ok ? r.json() : null }).then(function(j) { return j && j.hourly ? j : null }).catch(function() { return null }),
    ]).then(function(results) {
      setDados(results[0])
      setDadosMeteo(results[1])
      setLoading(false)
    }).catch(function() { setLoading(false) })
  }, [lat, lon])

  const dadosGrafico = dados && dadosMeteo && dadosMeteo.hourly ? dados.hourly.wave_height.map(function(h, i) {
    const hora = dados.hourly.time[i]
    const periodo = dados.hourly.wave_period[i]
    const energia = h && periodo ? Math.round(h * h * periodo * 500) : 0
    return {
      hora: hora ? hora.slice(11, 16) : '',
      ondas: h ? parseFloat(parseFloat(h).toFixed(2)) : 0,
      periodo: periodo ? parseFloat(parseFloat(periodo).toFixed(0)) : 0,
      direcao: dados.hourly.wave_direction && dados.hourly.wave_direction[i] != null ? getDirecao(dados.hourly.wave_direction[i]) : '',
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

  const diasInfoVento = dadosMeteo && dadosMeteo.hourly ? dadosMeteo.hourly.windspeed_10m.reduce(function(acc, v, i) {
    const dia = Math.floor(i / 24)
    if (!acc[dia]) acc[dia] = { min: v, max: v, abreviado: getDiaSemana(dia).abreviado }
    if (v < acc[dia].min) acc[dia].min = v
    if (v > acc[dia].max) acc[dia].max = v
    return acc
  }, []).map(function(d) { return { abreviado: d.abreviado, min: parseFloat(d.min.toFixed(0)), max: parseFloat(d.max.toFixed(0)) } }) : []

  // direcao atual de vento e swell (primeira hora valida) para as setas
  const swellDirAtual = dados && dados.hourly.wave_direction ? dados.hourly.wave_direction[12] : null
  const ventoDirAtual = dadosMeteo && dadosMeteo.hourly && dadosMeteo.hourly.winddirection_10m ? dadosMeteo.hourly.winddirection_10m[12] : null

  return (
    <div className='min-h-screen bg-white'>
      <Navbar />
      <div style={{ width: '100%', height: '450px', overflow: 'hidden', marginTop: '57px' }}>
        <MapaSatelite lat={lat} lon={lon} nome={nome} ventoDir={ventoDirAtual} swellDir={swellDirAtual} />
      </div>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 16px 60px' }}>
        <a href='/praias' style={{ color: '#9ca3af', fontSize: '13px', textDecoration: 'none', display: 'block', marginBottom: '12px' }}>← Voltar para Praias</a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
          <h1 className={lexend.className} style={{ fontSize: '32px', fontWeight: '700', letterSpacing: '-0.06em', color: 'black', WebkitTextStroke: '0.5px black' }}>{nome}</h1>
          <button onClick={function() { alternarFavorito(slug) }} style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#f3f4f6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} aria-label='Favoritar'>
            <svg width='20' height='20' viewBox='0 0 24 24' fill={ehFavorito(slug) ? '#ef4444' : 'none'} stroke={ehFavorito(slug) ? '#ef4444' : '#6b7280'} strokeWidth='2'><path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'/></svg>
          </button>
        </div>
        <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '24px' }}>Garopaba, Santa Catarina</p>

        <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: '24px' }}>
          {['resumo', 'graficos', 'avaliacoes'].map(function(a) {
            return (
              <button key={a} onClick={function() { setAba(a) }}
                className={lexendNormal.className}
                style={{ padding: '10px 20px', fontSize: '13px', color: aba === a ? 'black' : '#9ca3af', background: 'none', border: 'none', borderBottom: aba === a ? '2px solid black' : '2px solid transparent', cursor: 'pointer', fontWeight: aba === a ? '700' : '400', marginBottom: '-1px' }}>
                {a === 'resumo' ? 'Resumo' : a === 'graficos' ? 'Gráficos' : 'Como é surfar aqui'}
              </button>
            )
          })}
        </div>

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#9ca3af', padding: '60px 0', justifyContent: 'center' }}>
            <div style={{ width: '20px', height: '20px', border: '2px solid #e5e7eb', borderTop: '2px solid black', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            Carregando previsão...
          </div>
        )}

        {!loading && dados && aba === 'resumo' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
            <GraficoOndas dadosFull={dadosGrafico} diasInfo={diasInfo} />
            <GraficoComDias titulo='Vento' dados={dadosGrafico} dataKey='vento' cor='#06b6d4' unidade='km/h' diasInfo={diasInfoVento} />
            <GraficoComDias titulo='Energia das Ondas' dados={dadosGrafico} dataKey='energia' cor='#f59e0b' unidade='J' diasInfo={diasInfo} />
            <GraficoComDias titulo='Mares' dados={dadosGrafico} dataKey='mare' cor='#0d9488' unidade='m/s' diasInfo={diasInfo} />
          </div>
        )}

        {aba === 'avaliacoes' && (
          <AvaliacoesPraia nome={nome} slug={slug} />
        )}

      </div>
      <Footer />
    </div>
  )
}
