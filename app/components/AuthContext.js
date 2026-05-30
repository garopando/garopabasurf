'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [perfil, setPerfil] = useState(null)
  const [loading, setLoading] = useState(true)
  const [modalAberto, setModalAberto] = useState(false)

  useEffect(function() {
    supabase.auth.getSession().then(function({ data }) {
      const u = data.session ? data.session.user : null
      setUser(u)
      if (u) carregarPerfil(u.id)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange(function(_event, session) {
      const u = session ? session.user : null
      setUser(u)
      if (u) carregarPerfil(u.id); else setPerfil(null)
    })
    return function() { sub.subscription.unsubscribe() }
  }, [])

  function carregarPerfil(id) {
    supabase.from('profiles').select('*').eq('id', id).single().then(function({ data }) {
      if (data) setPerfil(data)
    })
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
    <AuthContext.Provider value={{ user, perfil, loading, cadastrar, entrar, sair, modalAberto, abrirModal: function() { setModalAberto(true) }, fecharModal: function() { setModalAberto(false) } }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
