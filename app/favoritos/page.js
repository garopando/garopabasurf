'use client'
import { Lexend } from 'next/font/google'
import { useAuth } from '../components/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const lexend = Lexend({ subsets: ['latin'], weight: '700' })

const praiasInfo = {
  'silveira-sul': { nome: 'Silveira Sul', lat: -28.044575, lon: -48.608818 },
  'silveira-norte': { nome: 'Silveira Norte', lat: -28.035384, lon: -48.603403 },
  'ferrugem-norte': { nome: 'Ferrugem Norte', lat: -28.075091, lon: -48.624343 },
  'ferrugem-sul': { nome: 'Ferrugem Sul', lat: -28.081375, lon: -48.627925 },
  'barra': { nome: 'Barra', lat: -28.086159, lon: -48.630842 },
  'siriu-norte': { nome: 'Siriú Norte', lat: -27.974714, lon: -48.627251 },
  'siriu-meio': { nome: 'Siriú - Meio de Praia', lat: -27.990017, lon: -48.630352 },
  'gamboa': { nome: 'Gamboa', lat: -27.959332, lon: -48.624417 },
  'ouvidor': { nome: 'Ouvidor', lat: -28.105132, lon: -48.635622 },
  'central': { nome: 'Praia Central', lat: -28.017217, lon: -48.624413 },
}

function getMapUrl(lat, lon) {
  return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox=' + (lon-0.008) + ',' + (lat-0.004) + ',' + (lon+0.008) + ',' + (lat+0.004) + '&bboxSR=4326&imageSR=4326&size=400,240&f=image'
}

export default function Favoritos() {
  const { user, loading, favoritos, alternarFavorito, abrirModal } = useAuth()

  return (
    <div className='min-h-screen bg-white'>
      <Navbar />
      <div style={{ maxWidth: '70%', margin: '0 auto', paddingTop: '100px', paddingBottom: '60px' }} className='hidden md:block'>
        <h1 className={lexend.className} style={{ fontSize: '32px', fontWeight: '700', letterSpacing: '-0.06em', color: 'black', marginBottom: '8px' }}>Minhas praias favoritas</h1>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '28px' }}>As praias que voce salvou para acompanhar.</p>
        <ConteudoFavoritos user={user} loading={loading} favoritos={favoritos} alternarFavorito={alternarFavorito} abrirModal={abrirModal} colunas={3} />
      </div>
      <div className='md:hidden' style={{ paddingTop: '90px', paddingBottom: '90px', paddingLeft: '16px', paddingRight: '16px' }}>
        <h1 className={lexend.className} style={{ fontSize: '26px', fontWeight: '700', letterSpacing: '-0.06em', color: 'black', marginBottom: '6px' }}>Minhas praias favoritas</h1>
        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>As praias que voce salvou para acompanhar.</p>
        <ConteudoFavoritos user={user} loading={loading} favoritos={favoritos} alternarFavorito={alternarFavorito} abrirModal={abrirModal} colunas={1} />
      </div>
      <Footer />
    </div>
  )
}

function ConteudoFavoritos({ user, loading, favoritos, alternarFavorito, abrirModal, colunas }) {
  if (loading) return <p style={{ color: '#9ca3af' }}>Carregando...</p>
  if (!user) {
    return (
      <div style={{ padding: '40px 0' }}>
        <p style={{ color: '#6b7280', marginBottom: '16px' }}>Entre na sua conta para ver e salvar praias favoritas.</p>
        <button onClick={abrirModal} className={lexend.className} style={{ padding: '12px 24px', background: 'black', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', cursor: 'pointer' }}>Entrar</button>
      </div>
    )
  }
  if (favoritos.length === 0) {
    return (
      <div style={{ padding: '40px 0' }}>
        <p style={{ color: '#6b7280', marginBottom: '16px' }}>Voce ainda nao favoritou nenhuma praia.</p>
        <a href='/praias' className={lexend.className} style={{ padding: '12px 24px', background: 'black', color: 'white', borderRadius: '10px', fontSize: '14px', textDecoration: 'none' }}>Explorar praias</a>
      </div>
    )
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(' + colunas + ', 1fr)', gap: '16px' }}>
      {favoritos.map(function(slug) {
        const p = praiasInfo[slug]
        if (!p) return null
        return (
          <div key={slug} style={{ borderRadius: '14px', border: '1px solid #eceef1', overflow: 'hidden', background: '#fff', position: 'relative' }}>
            <a href={'/praias/' + slug} style={{ textDecoration: 'none' }}>
              <div style={{ position: 'relative' }}>
                <img src={getMapUrl(p.lat, p.lon)} alt={p.nome} style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }} />
              </div>
              <div style={{ padding: '14px' }}>
                <h3 className={lexend.className} style={{ fontSize: '17px', fontWeight: '700', color: 'black', letterSpacing: '-0.04em' }}>{p.nome}</h3>
              </div>
            </a>
            <button onClick={function() { alternarFavorito(slug) }} style={{ position: 'absolute', top: '10px', right: '10px', width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.92)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} aria-label='Remover'>
              <svg width='18' height='18' viewBox='0 0 24 24' fill='#ef4444' stroke='#ef4444' strokeWidth='2'><path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'/></svg>
            </button>
          </div>
        )
      })}
    </div>
  )
}
