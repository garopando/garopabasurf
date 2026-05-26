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
  if (h < 0.5) return { label: 'Fraco', color: '#9ca3af', bg: '#f3f4f6' }
  if (h < 1.0) return { label: 'Regular', color: '#f59e0b', bg: '#fffbeb' }
  if (h < 1.8) return { label: 'Bom', color: '#22c55e', bg: '#f0fdf4' }
  if (h < 2.5) return { label: 'Ótimo', color: '#3b82f6', bg: '#eff6ff' }
  return { label: 'Excelente', color: '#8b5cf6', bg: '#f5f3ff' }
}

function getDirecao(graus) {
  const dirs = ['N','NNE','NE','ENE','L','ESE','SE','SSE','S','SSO','SO','OSO','O','ONO','NO','NNO']
  return dirs[Math.round(graus / 22.5) % 16]
}

function getDiaSemana(offset) {
  const dias = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
  const d = new Date()
  d.setDate(d.getDate() + offset)
  const label = offset === 0 ? 'Hoje' : offset === 1 ? 'Amanhã' : dias[d.getDay()]
  return { label, data: d.getDate() + '/' + (d.getMonth()+1) }
}

function MapaPrevisao({ lat, lon }) {
  const [MapComponents, setMapComponents] = useState(null)

  useEffect(function() {
    Promise.all([
      import('react-leaflet'),
      import('leaflet/dist/leaflet.css'),
    ]).then(function([rl]) {
      setMapComponents(rl)
    })
  }, [])

  if (!MapComponents) return <div className='flex items-center justify-center h-96 text-gray-400'>Carregando mapa...</div>

  const { MapContainer, TileLayer, Marker, Popup } = MapComponents

  return (
    <MapContainer center={[lat, lon]} zoom={13} style={{ height: '480px', width: '100%', borderRadius: '16px' }}>
      <TileLayer
        url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        attribution='Tiles &copy; Esri'
      />
      <Marker position={[lat, lon]}>
        <Popup>Silveira Sul</Popup>
      </Marker>
    </MapContainer>
  )
}

export default function SilveiraSul() {
  const [dados, setDados] = useState(null)
  const [loading, setLoading] = useState(true)
  const [aba, setAba] = useState('resumo')

  useEffect(function() {
    fetch('https://marine-api.open-meteo.com/v1/marine?latitude=' + LAT + '&longitude=' + LON + '&hourly=wave_height,wave_direction,wave_period,swell_wave_height,swell_wave_direction,swell_wave_period&daily=wave_height_max,wave_direction_dominant,wave_period_max&timezone=America/Sao_Paulo&forecast_days=7')
      .then(function(r) { return r.json() })
      .then(function(data) { setDados(data); setLoading(false) })
  }, [])

  const dadosGrafico = dados ? dados.hourly.wave_height.slice(0, 168).map(function(h, i) {
    const hora = dados.hourly.time[i]
    return {
      hora: hora.slice(11, 16),
      ondas: h ? parseFloat(h.toFixed(2)) : 0,
      swell: dados.hourly.swell_wave_height[i] ? parseFloat(dados.hourly.swell_wave_height[i].toFixed(2)) : 0,
    }
  }).filter(function(_, i) { return i % 3 === 0 }) : []

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
              <button
                key={a}
                onClick={function() { setAba(a) }}
                className={lexendNormal.className}
                style={{
                  padding: '10px 24px',
                  fontSize: '14px',
                  color: aba === a ? 'black' : '#9ca3af',
                  borderBottom: aba === a ? '2px solid black' : '2px solid transparent',
                  background: 'none',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  fontWeight: aba === a ? '700' : '400',
                  marginBottom: '-1px',
                }}
              >
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
                        <span className={lexend.className} style={{ fontSize: '22px', color: 'black', letterSpacing: '-0.04em' }}>{alturaMax.toFixed(1)}m</span>
                        <span className='text-sm font-bold px-3 py-1 rounded-full' style={{ color: s.color, backgroundColor: 'white' }}>{s.label}</span>
                        <span className='text-gray-400 text-sm'>Direção: {getDirecao(dados.daily.wave_direction_dominant[i])} · Período: {dados.daily.wave_period_max[i].toFixed(0)}s</span>
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
            <div>
              <h2 className={lexend.className} style={{ fontSize: '20px', color: 'black', letterSpacing: '-0.04em', marginBottom: '16px' }}>≋ Ondas</h2>
              <ResponsiveContainer width='100%' height={300}>
                <AreaChart data={dadosGrafico}>
                  <defs>
                    <linearGradient id='colorOndas' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset='5%' stopColor='#0d9488' stopOpacity={0.3}/>
                      <stop offset='95%' stopColor='#0d9488' stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                  <XAxis dataKey='hora' tick={{ fontSize: 11, fill: '#9ca3af' }} interval={7} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} unit='m' />
                  <Tooltip formatter={function(v) { return [v + 'm', 'Ondas'] }} />
                  <Area type='monotone' dataKey='ondas' stroke='#0d9488' strokeWidth={2} fill='url(#colorOndas)' />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h2 className={lexend.className} style={{ fontSize: '20px', color: 'black', letterSpacing: '-0.04em', marginBottom: '16px' }}>↑ Energia das Ondas (Swell)</h2>
              <ResponsiveContainer width='100%' height={300}>
                <AreaChart data={dadosGrafico}>
                  <defs>
                    <linearGradient id='colorSwell' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset='5%' stopColor='#3b82f6' stopOpacity={0.3}/>
                      <stop offset='95%' stopColor='#3b82f6' stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                  <XAxis dataKey='hora' tick={{ fontSize: 11, fill: '#9ca3af' }} interval={7} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} unit='m' />
                  <Tooltip formatter={function(v) { return [v + 'm', 'Swell'] }} />
                  <Area type='monotone' dataKey='swell' stroke='#3b82f6' strokeWidth={2} fill='url(#colorSwell)' />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {aba === 'mapa' && <MapaPrevisao lat={LAT} lon={LON} />}

      </div>
      <Footer />
    </div>
  )
}
