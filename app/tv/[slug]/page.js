'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Lexend } from 'next/font/google'

const lexend = Lexend({ subsets: ['latin'], weight: '700' })

function hashtagsDe(str) {
  if (!str) return []
  return str.split(/\s+/).filter(function(h){ return h.indexOf('#') === 0 })
}

export default function VideoPage() {
  const { slug } = useParams()
  const [video, setVideo] = useState(null)
  const [recomendados, setRecomendados] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(function() {
    if (!slug) return
    supabase.from('videos').select('*').eq('slug', slug).eq('publicado', true).single().then(function({ data }) {
      setVideo(data)
      if (data) {
        supabase.from('videos').select('*').eq('publicado', true).neq('slug', slug).order('criado_em', { ascending: false }).limit(3).then(function({ data: rec }) {
          setRecomendados(rec || [])
        })
      }
      setLoading(false)
    })
  }, [slug])

  if (loading) return <div className='min-h-screen bg-white'><Navbar /><div style={{ padding: '120px 16px', textAlign: 'center', color: '#9ca3af' }}>Carregando...</div><Footer /></div>
  if (!video) return <div className='min-h-screen bg-white'><Navbar /><div style={{ padding: '120px 16px', textAlign: 'center', color: '#9ca3af' }}>Vídeo não encontrado.</div><Footer /></div>

  return (
    <div className='min-h-screen bg-white'>
      <Navbar />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '90px 16px 70px' }}>
        <Link href='/tv' style={{ color: '#9ca3af', fontSize: '13px', textDecoration: 'none', display: 'block', marginBottom: '20px' }}>← Voltar para a TV</Link>

        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '14px', overflow: 'hidden', background: '#000', marginBottom: '24px' }}>
          <iframe
            src={'https://www.youtube.com/embed/' + video.youtube_id}
            title={video.titulo}
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          />
        </div>

        <h1 className={lexend.className} style={{ fontSize: '30px', fontWeight: '700', letterSpacing: '-0.06em', color: '#111', lineHeight: '1.2', marginBottom: '12px' }}>{video.titulo}</h1>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
          {hashtagsDe(video.categoria).map(function(t) {
            return <a key={t} href='/tv' style={{ fontSize: '13px', color: '#2563eb', textDecoration: 'none' }}>{t}</a>
          })}
        </div>

        {video.descricao && (
          <div className='video-desc' dangerouslySetInnerHTML={{ __html: video.descricao }} />
        )}

        {recomendados.length > 0 && (
          <div style={{ marginTop: '50px', paddingTop: '36px', borderTop: '1px solid #f3f4f6' }}>
            <h2 className={lexend.className} style={{ fontSize: '22px', color: '#111', letterSpacing: '-0.05em', marginBottom: '20px' }}>Mais vídeos</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '18px' }}>
              {recomendados.map(function(rec) {
                return (
                  <Link key={rec.id} href={'/tv/' + rec.slug} style={{ textDecoration: 'none' }}>
                    <img src={'https://img.youtube.com/vi/' + rec.youtube_id + '/hqdefault.jpg'} alt={rec.titulo} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: '10px', display: 'block', marginBottom: '8px' }} />
                    <h3 className={lexend.className} style={{ fontSize: '14px', color: '#111', letterSpacing: '-0.03em', lineHeight: '1.3' }}>{rec.titulo}</h3>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
      <Footer />
      <style>{`
        .video-desc p { font-size: 15px; line-height: 1.75; color: #374151; margin-bottom: 16px; }
        .video-desc strong { color: #111; font-weight: 700; }
        .video-desc h2 { font-size: 22px; font-weight: 700; color: #111; letter-spacing: -0.03em; margin: 28px 0 12px; }
        .video-desc h3 { font-size: 18px; font-weight: 700; color: #111; margin: 22px 0 8px; }
        .video-desc ul, .video-desc ol { padding-left: 24px; margin: 12px 0; color: #374151; }
        .video-desc li { margin-bottom: 6px; }
        .video-desc a { color: #2563eb; text-decoration: underline; }
        .video-desc em { font-style: italic; }
      `}</style>
    </div>
  )
}
