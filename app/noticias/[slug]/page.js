'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Lexend } from 'next/font/google'

const lexend = Lexend({ subsets: ['latin'], weight: '700' })
const lexendNormal = Lexend({ subsets: ['latin'], weight: '400' })

export default function PostPage() {
  const { slug } = useParams()

  useEffect(function() {
    if (!post) return
    setTimeout(function() {
      if (window.instgrm) {
        window.instgrm.Embeds.process()
      } else {
        const script = document.createElement('script')
        script.src = '//www.instagram.com/embed.js'
        script.async = true
        document.body.appendChild(script)
      }
    }, 500)
  }, [post])
  const [post, setPost] = useState(null)
  const [recomendados, setRecomendados] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(function() {
    if (!slug) return
    supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('publicado', true)
      .single()
      .then(function({ data }) {
        setPost(data)
        if (data) {
          supabase
            .from('posts')
            .select('*')
            .eq('publicado', true)
            .neq('slug', slug)
            .order('criado_em', { ascending: false })
            .limit(3)
            .then(function({ data: rec }) {
              setRecomendados(rec || [])
            })
        }
        setLoading(false)
      })
  }, [slug])

  if (loading) return (
    <div className='min-h-screen bg-white'>
      <Navbar />
      <div style={{ padding: '100px 16px', textAlign: 'center', color: '#9ca3af' }}>Carregando...</div>
      <Footer />
    </div>
  )

  if (!post) return (
    <div className='min-h-screen bg-white'>
      <Navbar />
      <div style={{ padding: '100px 16px', textAlign: 'center', color: '#9ca3af' }}>Post não encontrado.</div>
      <Footer />
    </div>
  )

  return (
    <div className='min-h-screen bg-white'>
      <Navbar />
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '100px 16px 60px' }}>
        <a href='/noticias' style={{ color: '#9ca3af', fontSize: '13px', textDecoration: 'none', display: 'block', marginBottom: '24px' }}>← Voltar para Notícias</a>

        {post.categoria && (
          <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px' }}>{post.categoria}</p>
        )}

        <h1 className={lexend.className} style={{ fontSize: '36px', fontWeight: '700', letterSpacing: '-0.06em', color: 'black', lineHeight: '1.2', marginBottom: '16px' }}>{post.titulo}</h1>

        <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '32px' }}>
          {new Date(post.criado_em).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
        </p>

        {post.thumbnail && (
          <div style={{ width: '100%', height: '400px', borderRadius: '16px', overflow: 'hidden', marginBottom: '40px' }}>
            <img src={post.thumbnail} alt={post.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}

        <div
          className='post-content'
          dangerouslySetInnerHTML={{ __html: post.conteudo }}
        />

        {recomendados.length > 0 && (
          <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '1px solid #f3f4f6' }}>
            <h2 className={lexend.className} style={{ fontSize: '24px', color: 'black', letterSpacing: '-0.06em', marginBottom: '24px' }}>Leia também</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {recomendados.map(function(rec) {
                return (
                  <a key={rec.id} href={'/noticias/' + rec.slug} style={{ textDecoration: 'none' }}>
                    {rec.thumbnail && (
                      <div style={{ width: '100%', height: '140px', borderRadius: '12px', overflow: 'hidden', marginBottom: '10px' }}>
                        <img src={rec.thumbnail} alt={rec.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    <h3 className={lexend.className} style={{ fontSize: '15px', color: 'black', letterSpacing: '-0.03em', lineHeight: '1.4' }}>{rec.titulo}</h3>
                    <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>{new Date(rec.criado_em).toLocaleDateString('pt-BR')}</p>
                  </a>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .post-content { font-size: 17px; line-height: 1.8; color: #111; }
        .post-content h1 { font-size: 32px; font-weight: 700; margin: 32px 0 16px; }
        .post-content h2 { font-size: 26px; font-weight: 700; margin: 28px 0 12px; }
        .post-content h3 { font-size: 22px; font-weight: 700; margin: 24px 0 10px; }
        .post-content p { margin: 0 0 16px; }
        .post-content ul, .post-content ol { padding-left: 28px; margin: 16px 0; }
        .post-content li { margin-bottom: 8px; }
        .post-content blockquote { border-left: 4px solid #e5e7eb; padding-left: 20px; color: #6b7280; margin: 24px 0; font-style: italic; }
        .post-content code { background: #f3f4f6; padding: 2px 8px; border-radius: 4px; font-size: 14px; }
        .post-content img { max-width: 100%; border-radius: 12px; margin: 24px 0; }
        .post-content a { color: #3b82f6; text-decoration: underline; }
        .post-content strong { font-weight: 700; }
        .post-content em { font-style: italic; }
      `}</style>

      <Footer />
    </div>
  )
}
