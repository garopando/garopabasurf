'use client'
import { Lexend } from 'next/font/google'
import { useEffect, useState, useRef } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const lexend = Lexend({ subsets: ['latin'], weight: '700' })

const praias = [
  { slug: 'silveira-sul', nome: 'Silveira Sul', lat: -28.044575, lon: -48.608818 },
  { slug: 'silveira-norte', nome: 'Silveira Norte', lat: -28.035384, lon: -48.603403 },
  { slug: 'ferrugem-norte', nome: 'Ferrugem Norte', lat: -28.075091, lon: -48.624343 },
  { slug: 'ferrugem-sul', nome: 'Ferrugem Sul', lat: -28.081375, lon: -48.627925 },
  { slug: 'barra', nome: 'Barra', lat: -28.086159, lon: -48.630842 },
  { slug: 'siriu-norte', nome: 'Siriu Norte', lat: -27.974714, lon: -48.627251 },
  { slug: 'siriu-meio', nome: 'Siriu - Meio de Praia', lat: -27.990017, lon: -48.630352 },
  { slug: 'gamboa', nome: 'Gamboa', lat: -27.959332, lon: -48.624417 },
  { slug: 'ouvidor', nome: 'Ouvidor', lat: -28.105132, lon: -48.635622 },
  { slug: 'central', nome: 'Praia Central', lat: -28.017217, lon: -48.624413 },
]

function getMapUrl(lat, lon, w, h) {
  return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox=' + (lon-0.008) + ',' + (lat-0.004) + ',' + (lon+0.008) + ',' + (lat+0.004) + '&bboxSR=4326&imageSR=4326&size=' + w + ',' + h + '&f=image'
}

function setaVento(graus, tamanho) {
  if (graus == null) return ''
  const t = tamanho || 14
  return '<svg width="' + t + '" height="' + t + '" viewBox="0 0 24 24" style="transform:rotate(' + (graus + 180) + 'deg);display:inline-block;vertical-align:middle;"><path d="M12 2 L18 20 L12 16 L6 20 Z" fill="#111"/></svg>'
}

function direcaoVento(graus) {
  if (graus == null) return ''
  const dirs = ['N','NE','L','SE','S','SO','O','NO']
  return dirs[Math.round(graus / 45) % 8]
}

function corOnda(alturaM, ventoKmh) {
  if (alturaM == null) return '#9ca3af'
  if (alturaM >= 0.8 && alturaM <= 2.5 && ventoKmh < 15) return '#22c55e'
  if (alturaM >= 0.5 && ventoKmh < 25) return '#eab308'
  return '#ef4444'
}

function classificar(alturaM, ventoKmh) {
  if (alturaM == null) return { label: '--', cor: '#9ca3af' }
  if (alturaM >= 0.8 && alturaM <= 2.5 && ventoKmh < 15) return { label: 'BOM', cor: '#22c55e' }
  if (alturaM >= 0.5 && ventoKmh < 25) return { label: 'REGULAR', cor: '#eab308' }
  return { label: 'FRACO', cor: '#ef4444' }
}

function SetaVentoEl({ graus }) {
  if (graus == null) return null
  return <span style={{ display: 'inline-block', verticalAlign: 'middle' }} dangerouslySetInnerHTML={{ __html: setaVento(graus, 14) }} />
}

export default function PraiasPage() {
  const [dados, setDados] = useState({})
  const mapRefDesktop = useRef(null)
  const mapRefMobile = useRef(null)
  const mapInstance = useRef(null)
  const markersRef = useRef({})
  const dadosRef = useRef({})

  useEffect(function() {
    const hoje = new Date().toISOString().slice(0, 10)
    praias.forEach(function(p) {
      const marineUrl = 'https://marine-api.open-meteo.com/v1/marine?latitude=' + p.lat + '&longitude=' + p.lon + '&hourly=wave_height&start_date=' + hoje + '&end_date=' + hoje + '&timezone=America/Sao_Paulo'
      const meteoUrl = 'https://api.open-meteo.com/v1/forecast?latitude=' + p.lat + '&longitude=' + p.lon + '&current=windspeed_10m,winddirection_10m&timezone=America/Sao_Paulo'
      Promise.all([fetch(marineUrl).then(function(r){return r.json()}), fetch(meteoUrl).then(function(r){return r.json()})])
        .then(function(res) {
          let min = null, max = null
          if (res[0] && res[0].hourly && res[0].hourly.wave_height) {
            const vals = res[0].hourly.wave_height.filter(function(v){ return v != null })
            if (vals.length) { min = Math.min.apply(null, vals); max = Math.max.apply(null, vals) }
          }
          const vento = res[1] && res[1].current ? res[1].current.windspeed_10m : null
          const dir = res[1] && res[1].current ? res[1].current.winddirection_10m : null
          setDados(function(prev) {
            const novo = Object.assign({}, prev)
            novo[p.slug] = { min: min, max: max, altura: max, vento: vento, dir: dir }
            dadosRef.current = novo
            return novo
          })
        })
        .catch(function() {})
    })
  }, [])

  useEffect(function() {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)
    function montar(alvo) {
      if (!alvo || alvo._leaflet_id) return
      const L = window.L
      const map = L.map(alvo).setView([-28.03, -48.62], 12)
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { attribution: '' }).addTo(map)
      praias.forEach(function(p) {
        const icon = L.divIcon({
          className: '',
          html: '<div id="pin-' + p.slug + '" style="display:inline-block;background:#9ca3af;color:#fff;font-weight:800;font-size:15px;letter-spacing:-0.02em;padding:7px 16px;border-radius:999px;box-shadow:0 4px 12px rgba(0,0,0,0.25);white-space:nowrap;border:2.5px solid #fff;font-family:system-ui,sans-serif;">--</div>',
          iconSize: [90, 36],
          iconAnchor: [45, 18]
        })
        const marker = L.marker([p.lat, p.lon], { icon: icon }).addTo(map)
        marker.bindPopup('<div style="font-weight:700;font-size:15px;margin-bottom:4px;">' + p.nome + '</div><div id="pop-' + p.slug + '" style="font-size:13px;color:#666;">Carregando...</div>', { closeButton: false })
        marker.on('mouseover', function() {
          const d = dadosRef.current[p.slug]
          let corpo = 'Carregando...'
          if (d) {
            const q = classificar(d.altura, d.vento)
            corpo = '<div style="font-weight:800;font-size:13px;color:' + q.cor + ';letter-spacing:0.05em;margin-bottom:8px;">' + q.label + '</div>'
              + '<div style="display:flex;gap:18px;">'
              + '<div><div style="font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.05em;">Surf</div><div style="font-size:15px;font-weight:700;color:#111;">' + ((d.min!=null&&d.max!=null)?d.min.toFixed(1)+'-'+d.max.toFixed(1)+'m':'--') + '</div></div>'
              + '<div><div style="font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.05em;">Vento</div><div style="font-size:15px;font-weight:700;color:#111;display:flex;align-items:center;gap:5px;">' + (d.vento!=null?Math.round(d.vento)+' km/h '+direcaoVento(d.dir)+' '+setaVento(d.dir,14):'--') + '</div></div>'
              + '</div>'
          }
          const html = '<div style="font-weight:800;font-size:16px;margin-bottom:6px;color:#111;">' + p.nome + '</div>' + corpo
          marker.setPopupContent(html)
          marker.openPopup()
        })
        marker.on('mouseout', function() { marker.closePopup() })
        marker.on('click', function() { window.location.href = '/praias/' + p.slug })
        markersRef.current[p.slug] = marker
      })
      setTimeout(function() { map.invalidateSize() }, 200)
    }
    function init() {
      montar(mapRefDesktop.current)
      montar(mapRefMobile.current)
    }
    if (window.L) {
      init()
    } else {
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.onload = init
      document.body.appendChild(script)
    }
  }, [])

  useEffect(function() {
    // atualiza pilulas
    praias.forEach(function(p) {
      const d = dados[p.slug]
      if (!d) return
      const el = document.getElementById('pin-' + p.slug)
      if (!el) return
      el.style.background = corOnda(d.altura, d.vento)
      el.textContent = (d.min != null && d.max != null) ? (d.min.toFixed(1) + '-' + d.max.toFixed(1) + 'm') : '--'
      const m = markersRef.current[p.slug]
      if (m) {
        const q = classificar(d.altura, d.vento)
        const html = '<div style="font-weight:700;font-size:15px;margin-bottom:6px;">' + p.nome + '</div>'
          + '<div style="font-weight:700;font-size:12px;color:' + q.cor + ';margin-bottom:6px;">' + q.label + '</div>'
          + '<div style="font-size:13px;color:#111;"><b>' + ((d.min != null && d.max != null) ? d.min.toFixed(1) + '-' + d.max.toFixed(1) + 'm' : '--') + '</b> &nbsp; ' + (d.vento != null ? Math.round(d.vento) + ' km/h' : '') + '</div>'
        m.setPopupContent(html)
      }
    })
  }, [dados])

  return (
    <div className='min-h-screen bg-white'>
      <Navbar />
      <div className='hidden md:flex' style={{ paddingTop: '64px', height: 'calc(100vh - 64px)' }}>
        <div style={{ width: '45%', overflowY: 'auto', padding: '32px' }}>
          <h1 className={lexend.className} style={{ fontSize: '32px', fontWeight: '700', letterSpacing: '-0.06em', marginBottom: '8px', color: 'black' }}>Surf Spots Garopaba</h1>
          <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5', marginBottom: '24px' }}>Explore os picos no mapa. Movimente a tela para ver as condicoes e as ondas de cada praia da Capital Catarinense do Surf.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {praias.map(function(praia) {
              const d = dados[praia.slug] || {}
              const q = classificar(d.altura, d.vento)
              return (
                <a key={praia.slug} href={'/praias/' + praia.slug} style={{ textDecoration: 'none', borderRadius: '14px', border: '1px solid #eceef1', overflow: 'hidden', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', transition: 'box-shadow 0.2s' }}>
                  <img src={getMapUrl(praia.lat, praia.lon, 400, 240)} alt={praia.nome} style={{ width: '100%', height: '130px', objectFit: 'cover', display: 'block' }} />
                  <div style={{ padding: '14px' }}>
                    <h3 className={lexend.className} style={{ fontSize: '17px', fontWeight: '700', color: 'black', letterSpacing: '-0.04em', marginBottom: '8px' }}>{praia.nome}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '800', color: q.cor, letterSpacing: '0.03em' }}>{q.label}</span>
                      <div style={{ display: 'flex', gap: '3px', flex: 1 }}>
                        {[0,1,2,3,4].map(function(i) {
                          const ativo = q.label === 'BOM' ? 5 : q.label === 'REGULAR' ? 3 : q.label === 'FRACO' ? 1 : 0
                          return <span key={i} style={{ flex: 1, height: '4px', borderRadius: '2px', background: i < ativo ? q.cor : '#e5e7eb' }} />
                        })}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '20px' }}>
                      <div>
                        <div style={{ fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Surf</div>
                        <div style={{ fontSize: '16px', fontWeight: '700', color: 'black' }}>{(d.min != null && d.max != null) ? d.min.toFixed(1) + '-' + d.max.toFixed(1) + 'm' : '--'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Vento</div>
                        <div style={{ fontSize: '16px', fontWeight: '700', color: 'black', display: 'flex', alignItems: 'center', gap: '5px' }}>{d.vento != null ? Math.round(d.vento) + ' km/h ' + direcaoVento(d.dir) : '--'}{d.vento != null && <SetaVentoEl graus={d.dir} />}</div>
                      </div>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        </div>
        <div ref={mapRefDesktop} style={{ width: '55%', height: '100%' }} />
      </div>

      <div className='md:hidden' style={{ paddingTop: '64px', paddingBottom: '80px' }}>
        <div ref={mapRefMobile} style={{ width: '100%', height: '300px' }} />
        <div style={{ padding: '16px' }}>
          <h1 className={lexend.className} style={{ fontSize: '26px', fontWeight: '700', letterSpacing: '-0.06em', color: 'black', marginBottom: '6px' }}>Surf Spots Garopaba</h1>
          <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.5', marginBottom: '18px' }}>Explore os picos no mapa. Movimente a tela para ver as condicoes e as ondas de cada praia da Capital Catarinense do Surf.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {praias.map(function(praia) {
              const d = dados[praia.slug] || {}
              const q = classificar(d.altura, d.vento)
              return (
                <a key={praia.slug} href={'/praias/' + praia.slug} style={{ textDecoration: 'none', borderRadius: '14px', border: '1px solid #eceef1', overflow: 'hidden', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <img src={getMapUrl(praia.lat, praia.lon, 400, 240)} alt={praia.nome} style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }} />
                  <div style={{ padding: '14px' }}>
                    <h3 className={lexend.className} style={{ fontSize: '18px', fontWeight: '700', color: 'black', letterSpacing: '-0.04em', marginBottom: '8px' }}>{praia.nome}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '800', color: q.cor, letterSpacing: '0.03em' }}>{q.label}</span>
                      <div style={{ display: 'flex', gap: '3px', flex: 1 }}>
                        {[0,1,2,3,4].map(function(i) {
                          const ativo = q.label === 'BOM' ? 5 : q.label === 'REGULAR' ? 3 : q.label === 'FRACO' ? 1 : 0
                          return <span key={i} style={{ flex: 1, height: '4px', borderRadius: '2px', background: i < ativo ? q.cor : '#e5e7eb' }} />
                        })}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '20px' }}>
                      <div>
                        <div style={{ fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Surf</div>
                        <div style={{ fontSize: '16px', fontWeight: '700', color: 'black' }}>{(d.min != null && d.max != null) ? d.min.toFixed(1) + '-' + d.max.toFixed(1) + 'm' : '--'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Vento</div>
                        <div style={{ fontSize: '16px', fontWeight: '700', color: 'black', display: 'flex', alignItems: 'center', gap: '5px' }}>{d.vento != null ? Math.round(d.vento) + ' km/h ' + direcaoVento(d.dir) : '--'}{d.vento != null && <SetaVentoEl graus={d.dir} />}</div>
                      </div>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
