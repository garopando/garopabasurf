'use client'
import { useEffect, useRef } from 'react'

export default function MapaSatelite({ lat, lon, nome }) {
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

      L.marker([lat, lon], { icon }).addTo(map)
        .bindPopup('<b>' + nome + '</b><br>Garopaba, SC')
        .openPopup()
    })

    return function() {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [lat, lon, nome])

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
  )
}
