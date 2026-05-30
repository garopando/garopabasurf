'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [perfil, setPerfil] = useState(null)
  const [loading, setLoading] = useState(true)
  const [modalAberto, setModalAberto] = useState(false)
  const [favoritos, setFavoritos] = useState([])

  useEffect(function() {
    supabase.auth.getSession().then(function({ data }) {
      const u = data.session ? data.session.user : null
      setUser(u)
      if (u) { carregarPerfil(u.id); carregarFavoritos(u.id) }
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange(function(_event, session) {
      const u = session ? session.user : null
      setUser(u)
      if (u) { carregarPerfil(u.id); carregarFavoritos(u.id) } else { setPerfil(null); setFavoritos([]) }
    })
    return function() { sub.subscription.unsubscribe() }
  }, [])

  function carregarPerfil(id) {
    supabase.from('profiles').select('*').eq('id', id).single().then(function({ data }) {
      if (data) setPerfil(data)
    })
  }

  function carregarFavoritos(id) {
    supabase.from('favoritos').select('praia_slug').eq('user_id', id).then(function({ data }) {
      if (data) setFavoritos(data.map(function(f) { return f.praia_slug }))
    })
  }

  async function alternarFavorito(slug) {
    if (!user) { setModalAberto(true); return }
    if (favoritos.indexOf(slug) >= 0) {
      setFavoritos(favoritos.filter(function(s) { return s !== slug }))
      await supabase.from('favoritos').delete().eq('user_id', user.id).eq('praia_slug', slug)
    } else {
      setFavoritos(favoritos.concat([slug]))
      await supabase.from('favoritos').insert({ user_id: user.id, praia_slug: slug })
    }
  }

  function ehFavorito(slug) {
    return favoritos.indexOf(slug) >= 0
  }

  async function cadastrar(nome, email, senha) {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: senha,
      options: { data: { nome: nome } },
    })
    return { data, error }
  }

  async function entrar(email, senha) {
    const { data, error } = await supabase.auth.signInWithPassword({ email: email, password: senha })
    return { data, error }
  }

  async function sair() {
    await supabase.auth.signOut()
    setUser(null)
    setPerfil(null)
  }

  return (
    <AuthContext.Provider value={{ user, perfil, loading, cadastrar, entrar, sair, modalAberto, abrirModal: function() { setModalAberto(true) }, fecharModal: function() { setModalAberto(false) }, favoritos, alternarFavorito, ehFavorito }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
