'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Lexend } from 'next/font/google'

const lexend = Lexend({ subsets: ['latin'], weight: '500' })

function CardNoticia({ post, altura }) {
  const img = post.thumbnail || 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80'
  return (
    <a href={'/noticias/' + post.slug} className='relative overflow-hidden rounded-xl flex items-end cursor-pointer group'
      style={{ backgroundImage: 'url(' + img + ')', backgroundSize: 'cover', backgroundPosition: 'center', minHeight: altura, textDecoration: 'none' }}>
      <div className='absolute inset-0 bg-black/50 group-hover:bg-black/60 transition' />
      <div className='relative z-10 p-4'>
        <h3 className={lexend.className} style={{ fontSize: '22px', color: 'white', fontWeight: '500', letterSpacing: '-0.03em', lineHeight: '1.2' }}>{post.titulo}</h3>
      </div>
    </a>
  )
}

export default function Noticias() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(function() {
    supabase.from('posts').select('*').eq('publicado', true).order('criado_em', { ascending: false }).limit(5).then(function({ data }) {
      setPosts(data || [])
      setLoading(false)
    })
  }, [])

  if (loading || posts.length === 0) return null

  const grandes = posts.slice(0, 2)
  const pequenas = posts.slice(2, 5)

  return (
    <section className='w-full py-10'>
      <div className='max-w-[70%] mx-auto hidden md:block'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className={lexend.className} style={{ fontSize: '28px', color: 'black', letterSpacing: '-0.06em', WebkitTextStroke: '0.5px black' }}>Noticias</h2>
          <a href='/noticias' className='px-5 py-2 bg-black text-white border border-black rounded-[10px] text-sm font-medium hover:bg-white hover:text-black transition'>Ver mais</a>
        </div>
        {grandes.length > 0 && (
          <div className='grid grid-cols-2 gap-3 mb-3'>
            {grandes.map(function(p) { return <CardNoticia key={p.id} post={p} altura='280px' /> })}
          </div>
        )}
        {pequenas.length > 0 && (
          <div className='grid grid-cols-3 gap-3'>
            {pequenas.map(function(p) { return <CardNoticia key={p.id} post={p} altura='180px' /> })}
          </div>
        )}
      </div>
      <div className='md:hidden px-4 w-full'>
        <div className='flex items-center justify-between mb-4 px-4'>
          <h2 className={lexend.className} style={{ fontSize: '24px', color: 'black', letterSpacing: '-0.06em', WebkitTextStroke: '0.5px black' }}>Noticias</h2>
          <a href='/noticias' className='px-4 py-2 bg-black text-white rounded-[10px] text-xs font-medium'>Ver mais</a>
        </div>
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
          {posts.map(function(p) {
            const img = p.thumbnail || 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80'
            return (
              <a key={p.id} href={'/noticias/' + p.slug} className='relative overflow-hidden rounded-xl flex items-end cursor-pointer flex-shrink-0'
                style={{ backgroundImage: 'url(' + img + ')', backgroundSize: 'cover', backgroundPosition: 'center', width: '160px', height: '160px', scrollSnapAlign: 'start', textDecoration: 'none' }}>
                <div className='absolute inset-0 bg-black/50' />
                <div className='relative z-10 p-3'>
                  <h3 className={lexend.className} style={{ fontSize: '12px', color: 'white', fontWeight: '500', letterSpacing: '-0.02em', lineHeight: '1.3' }}>{p.titulo}</h3>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
