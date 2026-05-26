'use client'
import { Lexend } from 'next/font/google'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useEffect, useState } from 'react'

const lexend = Lexend({ subsets: ['latin'], weight: '700' })

const LAT = -28.1850
const LON = -48.6150

function getStatus(waveHeight) {
  if (waveHeight < 0.5) return { label: 'Fraco', color: '#6b7280' }
  if (waveHeight < 1.0) return { label: 'Regular', color: '#f59e0b' }
  if (waveHeight < 1.8) return { label: 'Bom', color: '#22c55e' }
  if (waveHeight < 2.5) return { label: 'Otimo', color: '#3b82f6' }
  return { label: 'Excelente', color: '#8b5cf6' }
}

function getDirecao(graus) {
  const dirs = ['N','NE','L','SE','S','SO','O','NO']
  return dirs[Math.round(graus / 45) % 8]
}

export default function SilveiraSul() {
  const [dados, setDados] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(function() {
    fetch('https://marine-api.open-meteo.com/v1/marine?latitude=' + LAT + '&longitude=' + LON + '&daily=wave_height_max,wave_direction_dominant,wave_period_max&timezone=America/Sao_Paulo&forecast_days=7')
      .then(function(r) { return r.json() })
      .then(function(data) { setDados(data); setLoading(false) })
  }, [])

  const hoje = dados ? {
    altura: dados.daily.wave_height_max[0],
    direcao: getDirecao(dados.daily.wave_direction_dominant[0]),
    periodo: dados.daily.wave_period_max[0],
  } : null

  const status = hoje ? getStatus(hoje.altura) : null

  return (
    <div className='min-h-screen bg-white'>
      <Navbar />
      <div className='max-w-[70%] mx-auto pt-28 pb-16'>
        <a href='/praias' className='text-gray-400 text-sm hover:text-black transition mb-6 block'>← Voltar para Praias</a>
        <h1 className={lexend.className} style={{ fontSize: '40px', fontWeight: '700', letterSpacing: '-0.06em', color: 'black', WebkitTextStroke: '0.5px black', marginBottom: '4px' }}>Silveira Sul</h1>
        <p className='text-gray-500 text-sm mb-10'>Garopaba, Santa Catarina</p>
        {loading && <p className='text-gray-400'>Carregando previsao...</p>}
        {!loading && dados && (
          <>
            <div className='grid grid-cols-4 gap-4 mb-10'>
              <div className='rounded-2xl border border-gray-100 bg-gray-50 p-6 flex flex-col gap-2'>
                <span className='text-gray-400 text-xs uppercase tracking-widest'>Condicao</span>
                <span className='text-2xl font-bold' style={{ color: status.color }}>{status.label}</span>
              </div>
              <div className='rounded-2xl border border-gray-100 bg-gray-50 p-6 flex flex-col gap-2'>
                <span className='text-gray-400 text-xs uppercase tracking-widest'>Altura</span>
                <span className='text-2xl font-bold text-black'>{hoje.altura.toFixed(1)}m</span>
              </div>
              <div className='rounded-2xl border border-gray-100 bg-gray-50 p-6 flex flex-col gap-2'>
                <span className='text-gray-400 text-xs uppercase tracking-widest'>Periodo</span>
                <span className='text-2xl font-bold text-black'>{hoje.periodo.toFixed(0)}s</span>
              </div>
              <div className='rounded-2xl border border-gray-100 bg-gray-50 p-6 flex flex-col gap-2'>
                <span className='text-gray-400 text-xs uppercase tracking-widest'>Direcao</span>
                <span className='text-2xl font-bold text-black'>{hoje.direcao}</span>
              </div>
            </div>
            <h2 className={lexend.className} style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '-0.06em', color: 'black', WebkitTextStroke: '0.5px black', marginBottom: '16px' }}>Previsao 7 dias</h2>
            <div className='grid grid-cols-7 gap-3'>
              {dados.daily.wave_height_max.map(function(altura, i) {
                const s = getStatus(altura)
                const data = new Date()
                data.setDate(data.getDate() + i)
                const dia = data.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })
                return (
                  <div key={i} className='rounded-2xl border border-gray-100 bg-gray-50 p-4 flex flex-col gap-2 items-center text-center'>
                    <span className='text-gray-400 text-xs'>{dia}</span>
                    <span className='text-xl font-bold text-black'>{altura.toFixed(1)}m</span>
                    <span className='text-xs font-bold' style={{ color: s.color }}>{s.label}</span>
                    <span className='text-gray-400 text-xs'>{getDirecao(dados.daily.wave_direction_dominant[i])} · {dados.daily.wave_period_max[i].toFixed(0)}s</span>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}
