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

function classificar(alturaM, ventoKmh) {
  if (alturaM == null) return { label: '--', cor: '#9ca3af' }
  if (alturaM >= 0.8 && alturaM <= 2.5 && ventoKmh < 15) return { label: 'BOM', cor: '#22c55e' }
  if (alturaM >= 0.5 && ventoKmh < 25) return { label: 'REGULAR', cor: '#eab308' }
  return { label: 'FRACO', cor: '#ef4444' }
}

export default function PraiasPage() {
  const [dados, setDados] = useState({})
  const mapRefDesktop = useRef(null)
  const mapRefMobile = useRef(null)
  const mapInstance = useRef(null)

  useEffect(function() {
    const lats = praias.map(function(p) { return p.lat }).join(',')
    const lons = praias.map(function(p) { return p.lon }).join(',')
    const marineUrl = 'https://marine-api.open-meteo.com/v1/marine?latitude=' + lats + '&longitude=' + lons + '&current=wave_height&timezone=America/Sao_Paulo'
    const meteoUrl = 'https://api.open-meteo.com/v1/forecast?latitude=' + lats + '&longitude=' + lons + '&current=windspeed_10m&timezone=America/Sao_Paulo'
    Promise.all([fetch(marineUrl).then(function(r){return r.json()}), fetch(meteoUrl).then(function(r){return r.json()})])
      .then(function(res) {
        const marine = Array.isArray(res[0]) ? res[0] : [res[0]]
        const meteo = Array.isArray(res[1]) ? res[1] : [res[1]]
        const novo = {}
        praias.forEach(function(p, i) {
          const altura = marine[i] && marine[i].current ? marine[i].current.wave_height : null
          const vento = meteo[i] && meteo[i].current ? meteo[i].current.windspeed_10m : null
          novo[p.slug] = { altura: altura, vento: vento }
        })
        setDados(novo)
      })
      .catch(function() {})
  }, [])

  useEffect(function() {
    if (mapInstance.current) return
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = function() {
      const alvo = mapRefDesktop.current || mapRefMobile.current
      if (!alvo || mapInstance.current) return
      const L = window.L
      const map = L.map(alvo).setView([-28.03, -48.62], 12)
      mapInstance.current = map
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { attribution: '' }).addTo(map)
      praias.forEach(function(p) {
        const marker = L.circleMarker([p.lat, p.lon], { radius: 9, fillColor: '#111', color: '#fff', weight: 2, fillOpacity: 1 }).addTo(map)
        marker.bindPopup('<b>' + p.nome + '</b><br><a href="/praias/' + p.slug + '">Ver previsao</a>')
        marker.on('click', function() { window.location.href = '/praias/' + p.slug })
      })
    }
    document.body.appendChild(script)
  }, [])

  return (
    <div className='min-h-screen bg-white'>
      <Navbar />
      <div className='hidden md:flex' style={{ paddingTop: '64px', height: 'calc(100vh - 64px)' }}>
        <div style={{ width: '45%', overflowY: 'auto', padding: '32px' }}>
          <h1 className={lexend.className} style={{ fontSize: '34px', fontWeight: '700', letterSpacing: '-0.06em', marginBottom: '20px', color: 'black' }}>Praias</h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {praias.map(function(praia) {
              const d = dados[praia.slug] || {}
              const q = classificar(d.altura, d.vento)
              return (
                <a key={praia.slug} href={'/praias/' + praia.slug} style={{ textDecoration: 'none', display: 'flex', gap: '14px', alignItems: 'center', padding: '10px', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
                  <img src={getMapUrl(praia.lat, praia.lon, 160, 160)} alt={praia.nome} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <h3 className={lexend.className} style={{ fontSize: '17px', fontWeight: '700', color: 'black', letterSpacing: '-0.04em', marginBottom: '6px' }}>{praia.nome}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: q.cor }}>{q.label}</span>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: 'black' }}>{d.altura != null ? d.altura.toFixed(1) + 'm' : '--'}</span>
                      <span style={{ fontSize: '12px', color: '#9ca3af' }}>{d.vento != null ? Math.round(d.vento) + ' km/h' : ''}</span>
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
          <h1 className={lexend.className} style={{ fontSize: '26px', fontWeight: '700', letterSpacing: '-0.06em', color: 'black', marginBottom: '16px' }}>Praias</h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {praias.map(function(praia) {
              const d = dados[praia.slug] || {}
              const q = classificar(d.altura, d.vento)
              return (
                <a key={praia.slug} href={'/praias/' + praia.slug} style={{ textDecoration: 'none', display: 'flex', gap: '12px', alignItems: 'center', padding: '8px', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
                  <img src={getMapUrl(praia.lat, praia.lon, 160, 160)} alt={praia.nome} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <h3 className={lexend.className} style={{ fontSize: '16px', fontWeight: '700', color: 'black', letterSpacing: '-0.04em', marginBottom: '4px' }}>{praia.nome}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '10px', fontWeight: '700', color: q.cor }}>{q.label}</span>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: 'black' }}>{d.altura != null ? d.altura.toFixed(1) + 'm' : '--'}</span>
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
