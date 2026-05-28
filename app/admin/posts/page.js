'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import { Lexend } from 'next/font/google'

const lexend = Lexend({ subsets: ['latin'], weight: '700' })
const lexendNormal = Lexend({ subsets: ['latin'], weight: '400' })

export default function AdminPosts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(function() {
    if (localStorage.getItem('admin_auth') !== 'true') {
      router.push('/admin')
      return
    }
    carregarPosts()
  }, [])

  async function carregarPosts() {
    const { data } = await supabase.from('posts').select('*').order('criado_em', { ascending: false })
    setPosts(data || [])
    setLoading(false)
  }

  async function excluirPost(id) {
    if (!confirm('Tem certeza que deseja excluir este post?')) return
    await supabase.from('posts').delete().eq('id', id)
    carregarPosts()
  }

  async function togglePublicado(id, publicado) {
    await supabase.from('posts').update({ publicado: !publicado }).eq('id', id)
    carregarPosts()
  }

  function sair() {
    localStorage.removeItem('admin_auth')
    router.push('/admin')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <div style={{ background: 'black', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'between' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <h1 className={lexend.className} style={{ color: 'white', fontSize: '20px', letterSpacing: '-0.06em' }}>garopabasurf admin</h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={function() { router.push('/admin/posts/novo') }}
              style={{ background: 'white', color: 'black', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', fontWeight: '700' }}>
              + Novo Post
            </button>
            <button onClick={sair}
              style={{ background: 'transparent', color: '#9ca3af', border: '1px solid #374151', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer' }}>
              Sair
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 16px' }}>
        <h2 className={lexend.className} style={{ fontSize: '24px', color: 'black', letterSpacing: '-0.06em', marginBottom: '24px' }}>Posts</h2>

        {loading && <p style={{ color: '#9ca3af' }}>Carregando...</p>}

        {!loading && posts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
            <p>Nenhum post ainda.</p>
            <button onClick={function() { router.push('/admin/posts/novo') }}
              style={{ marginTop: '16px', background: 'black', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer', fontWeight: '700' }}>
              Criar primeiro post
            </button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {posts.map(function(post) {
            return (
              <div key={post.id} style={{ background: 'white', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #f3f4f6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {post.thumbnail && <img src={post.thumbnail} alt={post.titulo} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />}
                  <div>
                    <h3 className={lexend.className} style={{ fontSize: '16px', color: 'black', letterSpacing: '-0.03em', marginBottom: '4px' }}>{post.titulo}</h3>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {post.categoria && <span style={{ fontSize: '11px', background: '#f3f4f6', color: '#6b7280', padding: '2px 8px', borderRadius: '20px' }}>{post.categoria}</span>}
                      <span style={{ fontSize: '11px', color: '#9ca3af' }}>{new Date(post.criado_em).toLocaleDateString('pt-BR')}</span>
                      <span style={{ fontSize: '11px', color: post.publicado ? '#22c55e' : '#f59e0b', fontWeight: '600' }}>{post.publicado ? 'Publicado' : 'Rascunho'}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={function() { togglePublicado(post.id, post.publicado) }}
                    style={{ background: post.publicado ? '#fef3c7' : '#f0fdf4', color: post.publicado ? '#92400e' : '#166534', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}>
                    {post.publicado ? 'Despublicar' : 'Publicar'}
                  </button>
                  <button onClick={function() { router.push('/admin/posts/' + post.id) }}
                    style={{ background: '#f3f4f6', color: 'black', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}>
                    Editar
                  </button>
                  <button onClick={function() { excluirPost(post.id) }}
                    style={{ background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}>
                    Excluir
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
