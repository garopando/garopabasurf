'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Lexend } from 'next/font/google'

const lexend = Lexend({ subsets: ['latin'], weight: '700' })

function hashtagsDe(str) {
  if (!str) return []
  return str.split(/\s+/).filter(function(h){ return h.indexOf('#') === 0 })
}

export default function TV() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState(null)

  useEffect(function() {
    supabase.from('videos').select('*').eq('publicado', true).order('criado_em', { ascending: false }).then(function({ data }) {
      setVideos(data || [])
      setLoading(false)
    })
  }, [])

  // monta lista unica de hashtags de todos os videos
  const todasTags = []
  videos.forEach(function(v) {
    hashtagsDe(v.categoria).forEach(function(t) {
      if (todasTags.indexOf(t) < 0) todasTags.push(t)
    })
  })

  const filtrados = filtro ? videos.filter(function(v){ return hashtagsDe(v.categoria).indexOf(filtro) >= 0 }) : videos

  return (
    <div className='min-h-screen bg-white'>
      <Navbar />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '100px 16px 80px' }}>
        <h1 className={lexend.className} style={{ fontSize: '38px', fontWeight: '700', letterSpacing: '-0.06em', color: '#111', marginBottom: '6px' }}>GaropabaSurf TV</h1>
        <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '28px' }}>Surf, história e curiosidades em vídeo.</p>

        {todasTags.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
            <button onClick={function(){ setFiltro(null) }} className={lexend.className}
              style={{ padding: '7px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '13px', background: filtro === null ? '#111' : '#f3f4f6', color: filtro === null ? '#fff' : '#374151' }}>
              Todos
            </button>
            {todasTags.map(function(t) {
              return (
                <button key={t} onClick={function(){ setFiltro(t) }} className={lexend.className}
                  style={{ padding: '7px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '13px', background: filtro === t ? '#111' : '#f3f4f6', color: filtro === t ? '#fff' : '#374151' }}>
                  {t}
                </button>
              )
            })}
          </div>
        )}

        {loading && <p style={{ color: '#9ca3af' }}>Carregando...</p>}
        {!loading && videos.length === 0 && <p style={{ color: '#9ca3af', textAlign: 'center', padding: '60px 0' }}>Nenhum vídeo publicado ainda.</p>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {filtrados.map(function(v) {
            return (
              <a key={v.id} href={'/tv/' + v.slug} style={{ textDecoration: 'none' }}>
                <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', background: '#000' }}>
                  <img src={'https://img.youtube.com/vi/' + v.youtube_id + '/hqdefault.jpg'} alt={v.titulo} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderLeft: '16px solid white', marginLeft: '4px' }} />
                    </div>
                  </div>
                </div>
                <h3 className={lexend.className} style={{ fontSize: '16px', color: '#111', letterSpacing: '-0.03em', lineHeight: '1.3', margin: '12px 0 6px' }}>{v.titulo}</h3>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {hashtagsDe(v.categoria).map(function(t) {
                    return <span key={t} style={{ fontSize: '11px', color: '#2563eb' }}>{t}</span>
                  })}
                </div>
              </a>
            )
          })}
        </div>
      </div>
      <Footer />
    </div>
  )
}
