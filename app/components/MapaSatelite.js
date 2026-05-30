'use client'
import { useEffect, useRef } from 'react'

function dirTexto(graus) {
  if (graus == null) return '-'
  const dirs = ['N','NNE','NE','ENE','L','ESE','SE','SSE','S','SSO','SO','OSO','O','ONO','NO','NNO']
  return dirs[Math.round(graus / 22.5) % 16]
}
function setaHtml(graus, cor) {
  if (graus == null) return ''
  return '<svg width="18" height="18" viewBox="0 0 24 24" style="transform:rotate(' + (graus + 180) + 'deg);"><path d="M12 2 L18 20 L12 16 L6 20 Z" fill="' + cor + '"/></svg>'
}

export default function MapaSatelite({ lat, lon, nome, ventoDir, swellDir }) {
  const mapRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(function() {
    if (typeof window === 'undefined') return
    if (mapRef.current) return

    import('leaflet').then(function(L) {
      L = L.default

      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)

      const container = containerRef.current
      if (!container) return

      const map = L.map(container, {
        center: [lat, lon],
        zoom: 15,
        zoomControl: true,
      })

      mapRef.current = map

      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri',
        maxZoom: 19,
      }).addTo(map)

      L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
        attribution: '',
        maxZoom: 19,
      }).addTo(map)

      const icon = L.divIcon({
        html: '<div style="background:black;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 0 6px rgba(0,0,0,0.5)"></div>',
        iconSize: [14, 14],
        iconAnchor: [7, 7],
        className: '',
      })

      const popupHtml = '<div style="min-width:160px;">'
        + '<div style="font-weight:800;font-size:15px;color:#111;margin-bottom:2px;">' + nome + '</div>'
        + '<div style="font-size:11px;color:#9ca3af;margin-bottom:10px;">Garopaba, SC</div>'
        + '<div style="display:flex;gap:16px;">'
        + '<div style="display:flex;align-items:center;gap:6px;"><span>' + setaHtml(ventoDir, '#f97316') + '</span><div><div style="font-size:9px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.05em;">Vento</div><div style="font-size:13px;font-weight:700;color:#111;">' + dirTexto(ventoDir) + '</div></div></div>'
        + '<div style="display:flex;align-items:center;gap:6px;"><span>' + setaHtml(swellDir, '#06b6d4') + '</span><div><div style="font-size:9px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.05em;">Swell</div><div style="font-size:13px;font-weight:700;color:#111;">' + dirTexto(swellDir) + '</div></div></div>'
        + '</div></div>'
      L.marker([lat, lon], { icon }).addTo(map)
        .bindPopup(popupHtml)
        .openPopup()
    })

    return function() {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [lat, lon, nome, ventoDir, swellDir])

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
  )
}
