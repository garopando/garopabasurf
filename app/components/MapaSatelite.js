'use client'
import { useEffect } from 'react'

export default function MapaSatelite({ lat, lon, nome }) {
  useEffect(function() {
    if (typeof window === 'undefined') return

    const L = require('leaflet')
    require('leaflet/dist/leaflet.css')

    const container = document.getElementById('mapa-satelite')
    if (!container) return
    if (container._leaflet_id) return

    const map = L.map('mapa-satelite', {
      center: [lat, lon],
      zoom: 15,
      zoomControl: true,
    })

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri',
      maxZoom: 19,
    }).addTo(map)

    L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
      attribution: '',
      maxZoom: 19,
      opacity: 1,
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

    return function() {
      map.remove()
    }
  }, [lat, lon, nome])

  return (
    <>
      <link rel='stylesheet' href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css' />
      <div id='mapa-satelite' style={{ width: '100%', height: '100%', borderRadius: '16px' }} />
    </>
  )
}
