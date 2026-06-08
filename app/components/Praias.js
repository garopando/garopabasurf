'use client'
import { Lexend } from 'next/font/google'
import { useEffect, useState } from 'react'

const lexend = Lexend({ subsets: ['latin'], weight: '500' })

const praias = [
  { nome: 'Silveira Sul', slug: 'silveira-sul', lat: -28.044575, lon: -48.608818 },
  { nome: 'Silveira Norte', slug: 'silveira-norte', lat: -28.035384, lon: -48.603403 },
  { nome: 'Ferrugem Norte', slug: 'ferrugem-norte', lat: -28.075091, lon: -48.624343 },
  { nome: 'Ferrugem Sul', slug: 'ferrugem-sul', lat: -28.081375, lon: -48.627925 },
  { nome: 'Barra', slug: 'barra', lat: -28.086159, lon: -48.630842 },
  { nome: 'Siriú Norte', slug: 'siriu-norte', lat: -27.974714, lon: -48.627251 },
  { nome: 'Siriú Meio', slug: 'siriu-meio', lat: -27.990017, lon: -48.630352 },
  { nome: 'Gamboa', slug: 'gamboa', lat: -27.959332, lon: -48.624417 },
  { nome: 'Ouvidor', slug: 'ouvidor', lat: -28.105132, lon: -48.635622 },
  { nome: 'Praia Central', slug: 'central', lat: -28.017217, lon: -48.624413 },
]

// pontua a condicao ATUAL: onda na faixa ideal + vento fraco = melhor
function pontuar(ondaM, ventoKmh) {
  if (ondaM == null) return -1
  let p = 0
  if (ondaM >= 0.8 && ondaM <= 2.5) p += 50 + (10 - Math.abs(ondaM - 1.5) * 4)
  else if (ondaM >= 0.5) p += 25
  else p += 5
  if (ventoKmh != null) {
    if (ventoKmh < 10) p += 30
    else if (ventoKmh < 18) p += 18
    else if (ventoKmh < 28) p += 8
  }
  return p
}

function corOnda(alturaM) {
  if (alturaM == null) return '#e5e7eb'
  if (alturaM >= 0.8 && alturaM <= 2.5) return '#22c55e'
  if (alturaM >= 0.5) return '#eab308'
  return '#ef4444'
}

const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']

function curvaPath(vals, largura, altura) {
  const n = vals.length
  if (n === 0) return ''
  const maxV = Math.max.apply(null, vals.filter(function(v){return v!=null})) || 1
  const minV = 0
  const pts = vals.map(function(v, i) {
    const x = (i / (n - 1)) * largura
    const vv = v != null ? v : minV
    // normaliza: ondas maiores = mais alto (y menor); deixa margem de 30% no topo
    const y = altura - ((vv - minV) / (maxV - minV || 1)) * (altura * 0.6) - (altura * 0.15)
    return [x, y]
  })
  // curva suave com Catmull-Rom -> Bezier
  let d = 'M ' + pts[0][0] + ' ' + pts[0][1]
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[i === 0 ? 0 : i - 1]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2 < n ? i + 2 : n - 1]
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6
    d += ' C ' + cp1x + ' ' + cp1y + ', ' + cp2x + ' ' + cp2y + ', ' + p2[0] + ' ' + p2[1]
  }
  // fecha a area ate a base
  d += ' L ' + largura + ' ' + altura + ' L 0 ' + altura + ' Z'
  return d
}

function GraficoFundo({ vals }) {
  if (!vals || vals.length === 0) return null
  const limpos = vals.filter(function(v){ return v != null })
  const maxV = limpos.length ? Math.max.apply(null, limpos) : 1
  function cor(v) {
    if (v == null) return '#cdeeeb'
    const r = v / (maxV || 1)
    if (r < 0.4) return '#cdeeeb'
    if (r < 0.7) return '#9bdbd5'
    return '#5dcaa5'
  }
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', gap: '3px', padding: '0 2px', zIndex: 0, opacity: 0.55 }}>
      {vals.map(function(v, i) {
        const h = v != null && maxV > 0 ? Math.max(6, (v / maxV) * 100) : 6
        return <div key={i} style={{ flex: 1, height: h + '%', background: cor(v), borderRadius: '2px 2px 0 0' }} />
      })}
    </div>
  )
}

export default function Praias() {
  const [dados, setDados] = useState({})
  const [dias, setDias] = useState([])
  const [atual, setAtual] = useState({})
  const [horas, setHoras] = useState({})

  const ranqueadas = praias.slice().sort(function(a, b) {
    const ca = atual[a.slug] || {}
    const cb = atual[b.slug] || {}
    return pontuar(cb.onda, cb.vento) - pontuar(ca.onda, ca.vento)
  }).slice(0, 5)

  useEffect(function() {
    praias.forEach(function(p) {
      const url = 'https://marine-api.open-meteo.com/v1/marine?latitude=' + p.lat + '&longitude=' + p.lon + '&daily=wave_height_max&hourly=wave_height&current=wave_height&forecast_days=5&timezone=America/Sao_Paulo'
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
          if (res.hourly && res.hourly.wave_height) {
            setHoras(function(prev) {
              const novo = Object.assign({}, prev)
              novo[p.slug] = res.hourly.wave_height.filter(function(v, i){ return i % 3 === 0 })
              return novo
            })
          }
          const ondaAgora = res.current ? res.current.wave_height : null
          setAtual(function(prev) {
            const novo = Object.assign({}, prev)
            novo[p.slug] = Object.assign({}, novo[p.slug], { onda: ondaAgora })
            return novo
          })
        }
      }).catch(function(){})
      const urlV = 'https://api.open-meteo.com/v1/forecast?latitude=' + p.lat + '&longitude=' + p.lon + '&current=windspeed_10m&timezone=America/Sao_Paulo'
      fetch(urlV).then(function(r){return r.json()}).then(function(res) {
        if (res && res.current) {
          setAtual(function(prev) {
            const novo = Object.assign({}, prev)
            novo[p.slug] = Object.assign({}, novo[p.slug], { vento: res.current.windspeed_10m })
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
        {ranqueadas.map(function(p) {
          const vals = dados[p.slug] || []
          return (
            <a key={p.slug} href={'/praias/' + p.slug} onMouseEnter={function(e){ e.currentTarget.style.background='#f7f9fb' }} onMouseLeave={function(e){ e.currentTarget.style.background='transparent' }} style={{ textDecoration: 'none', display: 'grid', gridTemplateColumns: '160px repeat(5, 1fr)', alignItems: 'center', padding: '14px 0', borderTop: '1px solid #f3f4f6', position: 'relative', borderRadius: '8px', transition: 'background 0.15s' }}>
              <div style={{ position: 'absolute', left: '160px', right: 0, top: 0, bottom: 0, zIndex: 0 }}><GraficoFundo vals={horas[p.slug] || []} /></div>
              <div className={lexend.className} style={{ fontSize: '16px', color: '#111', fontWeight: '500', letterSpacing: '-0.03em', position: 'relative', zIndex: 1 }}>{p.nome}</div>
              {[0,1,2,3,4].map(function(i) {
                const v = vals[i]
                return (
                  <div key={i} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
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
        <div className='mb-8'>
          <h2 className={lexend.className} style={{ fontSize: '28px', color: 'black', letterSpacing: '-0.06em', WebkitTextStroke: '0.5px black' }}>Surf Spots Garopaba</h2>
        </div>
        <Tabela />
        <a href='/praias' className='block text-center mt-8 px-6 py-3 bg-black text-white border border-black rounded-[10px] text-sm font-medium hover:bg-white hover:text-black transition' style={{ textDecoration: 'none' }}>Ver todas as praias</a>
      </div>
      <div className='md:hidden px-4'>
        <div className='mb-4'>
          <h2 className={lexend.className} style={{ fontSize: '22px', color: 'black', letterSpacing: '-0.06em', WebkitTextStroke: '0.5px black' }}>Surf Spots Garopaba</h2>
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
            {ranqueadas.map(function(p) {
              const vals = dados[p.slug] || []
              return (
                <a key={p.slug} href={'/praias/' + p.slug} style={{ textDecoration: 'none', display: 'grid', gridTemplateColumns: '110px repeat(5, 1fr)', alignItems: 'center', padding: '12px 0', borderTop: '1px solid #f3f4f6', position: 'relative', borderRadius: '8px' }}>
                  <div style={{ position: 'absolute', left: '110px', right: 0, top: 0, bottom: 0, zIndex: 0 }}><GraficoFundo vals={horas[p.slug] || []} /></div>
                  <div className={lexend.className} style={{ fontSize: '14px', color: '#111', fontWeight: '500', letterSpacing: '-0.03em', position: 'relative', zIndex: 1 }}>{p.nome}</div>
                  {[0,1,2,3,4].map(function(i) {
                    const v = vals[i]
                    return (
                      <div key={i} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
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
        <a href='/praias' className='block text-center mt-6 px-6 py-3 bg-black text-white rounded-[10px] text-sm font-medium' style={{ textDecoration: 'none' }}>Ver todas as praias</a>
      </div>
    </section>
  )
}
