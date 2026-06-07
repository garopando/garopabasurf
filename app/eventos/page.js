'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Lexend } from 'next/font/google'

const lexend = Lexend({ subsets: ['latin'], weight: '700' })
const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const diasSem = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']

function dataObj(d) { return new Date(d + 'T12:00:00') }
function fmtData(d) {
  const o = dataObj(d)
  return o.getDate() + ' ' + meses[o.getMonth()].slice(0,3).toLowerCase() + '. ' + o.getFullYear()
}

export default function Eventos() {
  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(true)
  const [aba, setAba] = useState('lista')
  const [mesAtual, setMesAtual] = useState(new Date())

  useEffect(function() {
    supabase.from('eventos').select('*').eq('publicado', true).order('data_inicio', { ascending: true }).then(function({ data }) {
      setEventos(data || [])
      setLoading(false)
    })
  }, [])

  // ordena: futuros primeiro (por proximidade), passados depois
  const hoje = new Date(); hoje.setHours(0,0,0,0)
  const ordenados = eventos.slice().sort(function(a, b) {
    const da = dataObj(a.data_fim || a.data_inicio), db = dataObj(b.data_fim || b.data_inicio)
    const aPassou = da < hoje, bPassou = db < hoje
    if (aPassou !== bPassou) return aPassou ? 1 : -1
    return dataObj(a.data_inicio) - dataObj(b.data_inicio)
  })

  return (
    <div className='min-h-screen bg-white'>
      <Navbar />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '100px 16px 80px' }}>
        <h1 className={lexend.className} style={{ fontSize: '38px', fontWeight: '700', letterSpacing: '-0.06em', color: '#111', marginBottom: '6px' }}>Eventos</h1>
        <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '28px' }}>Campeonatos de surf e eventos em Garopaba.</p>

        <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid #f3f4f6', marginBottom: '28px' }}>
          {[['lista','Lista'],['calendario','Calendário']].map(function(t) {
            const ativo = aba === t[0]
            return (
              <button key={t[0]} onClick={function() { setAba(t[0]) }} className={lexend.className}
                style={{ background: 'none', border: 'none', padding: '10px 18px', fontSize: '15px', cursor: 'pointer', color: ativo ? '#111' : '#9ca3af', borderBottom: ativo ? '2px solid #111' : '2px solid transparent', marginBottom: '-1px', letterSpacing: '-0.02em' }}>
                {t[1]}
              </button>
            )
          })}
        </div>

        {loading && <p style={{ color: '#9ca3af' }}>Carregando...</p>}
        {!loading && eventos.length === 0 && <p style={{ color: '#9ca3af', textAlign: 'center', padding: '60px 0' }}>Nenhum evento publicado ainda.</p>}

        {!loading && aba === 'lista' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {ordenados.map(function(ev) {
              const passou = dataObj(ev.data_fim || ev.data_inicio) < hoje
              return (
                <div key={ev.id} style={{ display: 'flex', gap: '18px', border: '1px solid #eceef1', borderRadius: '14px', overflow: 'hidden', opacity: passou ? 0.55 : 1 }}>
                  {ev.thumbnail && <img src={ev.thumbnail} alt={ev.titulo} style={{ width: '140px', height: '140px', objectFit: 'cover', flexShrink: 0 }} />}
                  <div style={{ padding: '16px 16px 16px 0', flex: 1 }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
                      {ev.tipo && <span style={{ fontSize: '11px', fontWeight: '700', color: ev.tipo === 'Campeonato' ? '#0369a1' : '#9333ea', background: ev.tipo === 'Campeonato' ? '#e0f2fe' : '#f3e8ff', padding: '3px 10px', borderRadius: '20px' }}>{ev.tipo}</span>}
                      {passou && <span style={{ fontSize: '11px', color: '#9ca3af' }}>Encerrado</span>}
                    </div>
                    <h3 className={lexend.className} style={{ fontSize: '19px', color: '#111', letterSpacing: '-0.04em', lineHeight: '1.2', marginBottom: '8px' }}>{ev.titulo}</h3>
                    <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                      📅 {fmtData(ev.data_inicio)}{ev.data_fim ? ' até ' + fmtData(ev.data_fim) : ''}{ev.hora ? ' · ' + ev.hora : ''}
                    </p>
                    {ev.local && <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>📍 {ev.local}</p>}
                    {ev.descricao && <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.5', marginBottom: '8px' }}>{ev.descricao}</p>}
                    {ev.link && <a href={ev.link} target='_blank' rel='noreferrer' style={{ fontSize: '13px', color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>Mais informações →</a>}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {!loading && aba === 'calendario' && (
          <Calendario eventos={eventos} mesAtual={mesAtual} setMesAtual={setMesAtual} />
        )}
      </div>
      <Footer />
    </div>
  )
}

function Calendario({ eventos, mesAtual, setMesAtual }) {
  const [isMobile, setIsMobile] = useState(false)
  const [diaSel, setDiaSel] = useState(null)
  useEffect(function() {
    function check() { setIsMobile(window.innerWidth < 640) }
    check()
    window.addEventListener('resize', check)
    return function() { window.removeEventListener('resize', check) }
  }, [])
  const ano = mesAtual.getFullYear(), mes = mesAtual.getMonth()
  const primeiroDia = new Date(ano, mes, 1).getDay()
  const diasNoMes = new Date(ano, mes + 1, 0).getDate()

  function eventosNoDia(dia) {
    const alvo = new Date(ano, mes, dia); alvo.setHours(0,0,0,0)
    return eventos.filter(function(ev) {
      const ini = dataObj(ev.data_inicio); ini.setHours(0,0,0,0)
      const fim = dataObj(ev.data_fim || ev.data_inicio); fim.setHours(0,0,0,0)
      return alvo >= ini && alvo <= fim
    })
  }

  const celulas = []
  for (let i = 0; i < primeiroDia; i++) celulas.push(null)
  for (let d = 1; d <= diasNoMes; d++) celulas.push(d)

  const hoje = new Date()
  const ehHoje = function(d) { return d === hoje.getDate() && mes === hoje.getMonth() && ano === hoje.getFullYear() }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button onClick={function() { setMesAtual(new Date(ano, mes - 1, 1)) }} style={{ background: '#f3f4f6', border: 'none', borderRadius: '8px', width: '36px', height: '36px', cursor: 'pointer', fontSize: '18px', color: '#111' }}>‹</button>
        <h3 className={lexend.className} style={{ fontSize: '20px', color: '#111', letterSpacing: '-0.04em' }}>{meses[mes]} {ano}</h3>
        <button onClick={function() { setMesAtual(new Date(ano, mes + 1, 1)) }} style={{ background: '#f3f4f6', border: 'none', borderRadius: '8px', width: '36px', height: '36px', cursor: 'pointer', fontSize: '18px', color: '#111' }}>›</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '4px' }}>
        {diasSem.map(function(d) { return <div key={d} style={{ textAlign: 'center', fontSize: isMobile ? '10px' : '11px', color: '#9ca3af', fontWeight: '700', padding: '6px 0' }}>{isMobile ? d.charAt(0) : d}</div> })}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: isMobile ? '3px' : '4px' }}>
        {celulas.map(function(dia, i) {
          if (dia === null) return <div key={'e'+i} />
          const evs = eventosNoDia(dia)
          const tem = evs.length > 0
          if (isMobile) {
            const sel = diaSel === dia
            return (
              <button key={dia} onClick={function() { if (tem) setDiaSel(sel ? null : dia) }}
                style={{ aspectRatio: '1', borderRadius: '8px', border: sel ? '2px solid #0369a1' : '1px solid #f3f4f6', padding: '0', background: tem ? '#f0f9ff' : 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px', cursor: tem ? 'pointer' : 'default' }}>
                <span style={{ fontSize: '13px', fontWeight: ehHoje(dia) ? '700' : '500', color: ehHoje(dia) ? '#fff' : '#374151', background: ehHoje(dia) ? '#111' : 'transparent', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{dia}</span>
                {tem && <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#0369a1' }} />}
              </button>
            )
          }
          return (
            <div key={dia} title={evs.map(function(e){return e.titulo}).join(', ')}
              style={{ minHeight: '64px', borderRadius: '8px', border: '1px solid #f3f4f6', padding: '6px', background: tem ? '#f0f9ff' : 'white', position: 'relative' }}>
              <div style={{ fontSize: '12px', fontWeight: ehHoje(dia) ? '700' : '500', color: ehHoje(dia) ? '#fff' : '#374151', background: ehHoje(dia) ? '#111' : 'transparent', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{dia}</div>
              {evs.slice(0,2).map(function(ev) {
                return <div key={ev.id} style={{ fontSize: '9px', color: '#0369a1', background: '#e0f2fe', borderRadius: '4px', padding: '1px 4px', marginTop: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.titulo}</div>
              })}
              {evs.length > 2 && <div style={{ fontSize: '9px', color: '#9ca3af', marginTop: '2px' }}>+{evs.length - 2}</div>}
            </div>
          )
        })}
      </div>
      {isMobile && diaSel != null && eventosNoDia(diaSel).length > 0 && (
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <p style={{ fontSize: '13px', fontWeight: '700', color: '#111' }}>{diaSel} de {meses[mes]}</p>
          {eventosNoDia(diaSel).map(function(ev) {
            return (
              <div key={ev.id} style={{ border: '1px solid #f0f0f0', borderRadius: '10px', padding: '12px', background: '#f0f9ff' }}>
                {ev.tipo && <span style={{ fontSize: '11px', fontWeight: '700', color: ev.tipo === 'Campeonato' ? '#0369a1' : '#9333ea', background: ev.tipo === 'Campeonato' ? '#e0f2fe' : '#f3e8ff', padding: '3px 10px', borderRadius: '20px' }}>{ev.tipo}</span>}
                <h4 className={lexend.className} style={{ fontSize: '16px', color: '#111', letterSpacing: '-0.03em', margin: '8px 0 4px' }}>{ev.titulo}</h4>
                {ev.local && <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>📍 {ev.local}</p>}
                {ev.descricao && <p style={{ fontSize: '13px', color: '#374151', lineHeight: '1.5', marginBottom: '6px' }}>{ev.descricao}</p>}
                {ev.link && <a href={ev.link} target='_blank' rel='noreferrer' style={{ fontSize: '13px', color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>Mais informações →</a>}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
