'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Lexend } from 'next/font/google'

const lexend = Lexend({ subsets: ['latin'], weight: '700' })
const lexendNormal = Lexend({ subsets: ['latin'], weight: '400' })

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(function() {
    supabase
      .from('posts')
      .select('*')
      .eq('publicado', true)
      .order('criado_em', { ascending: false })
      .then(function({ data }) {
        setPosts(data || [])
        setLoading(false)
      })
  }, [])

  return (
    <div className='min-h-screen bg-white'>
      <Navbar />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '100px 16px 60px' }}>
        <h1 className={lexend.className} style={{ fontSize: '40px', fontWeight: '700', letterSpacing: '-0.06em', color: 'black', WebkitTextStroke: '0.5px black', marginBottom: '8px' }}>Blog</h1>
        <p className={lexendNormal.className} style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '40px' }}>Tudo sobre surf e Garopaba</p>

        {loading && <p style={{ color: '#9ca3af' }}>Carregando...</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {posts.map(function(post) {
            return (
              <a key={post.id} href={'/blog/' + post.slug} style={{ textDecoration: 'none', display: 'flex', gap: '20px', borderBottom: '1px solid #f3f4f6', paddingBottom: '24px' }}>
                {post.thumbnail && (
                  <div style={{ width: '180px', height: '120px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                    <img src={post.thumbnail} alt={post.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  {post.categoria && (
                    <p style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '6px' }}>{post.categoria}</p>
                  )}
                  <h2 className={lexend.className} style={{ fontSize: '20px', color: 'black', letterSpacing: '-0.04em', marginBottom: '8px', lineHeight: '1.3' }}>{post.titulo}</h2>
                  {post.resumo && <p className={lexendNormal.className} style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6', marginBottom: '8px' }}>{post.resumo}</p>}
                  <p style={{ fontSize: '12px', color: '#9ca3af' }}>{new Date(post.criado_em).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </div>
              </a>
            )
          })}
        </div>

        {!loading && posts.length === 0 && (
          <p className={lexendNormal.className} style={{ color: '#9ca3af', textAlign: 'center', padding: '60px 0' }}>Nenhuma notícia publicada ainda.</p>
        )}
      </div>
      <Footer />
    </div>
  )
}
