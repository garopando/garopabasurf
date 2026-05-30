'use client'
import { useSearchParams } from 'next/navigation'
import { Lexend } from 'next/font/google'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Suspense } from 'react'

const lexend = Lexend({ subsets: ['latin'], weight: '700' })
const lexendNormal = Lexend({ subsets: ['latin'], weight: '400' })

const praias = [
  { nome: 'Silveira Sul', slug: 'silveira-sul', descricao: 'Pico sul do Silveira, famoso por ondas tubulares e consistentes.', img: 'https://cdn.sanity.io/images/we0tdimr/production/724f27b9d80ec98374af7cc4c2e8afc3d3d541d4-1920x1252.jpg' },
  { nome: 'Silveira Norte', slug: 'silveira-norte', descricao: 'Pico norte do Silveira, ondas mais abertas e ideais para manobras.', img: 'https://www.waves.com.br/wp-content/uploads/2018/10/12-Praia-do-silveira-foto-AiltonSouzaPhotography.jpg' },
  { nome: 'Ferrugem Norte', slug: 'ferrugem-norte', descricao: 'Pico norte da Ferrugem com ondas potentes.', img: 'https://radioestacaogaropaba.com/wp-content/uploads/2026/03/DJI_20260218084656_0125_D-1024x576.jpg' },
  { nome: 'Ferrugem Sul', slug: 'ferrugem-sul', descricao: 'Pico sul da Ferrugem, mais protegido do vento norte.', img: 'https://www.waves.com.br/wp-content/uploads/2020/11/Bernardo-Villanueva-Praia-da-ferrugem-2-1024x683.jpg' },
  { nome: 'Barra', slug: 'barra', descricao: 'Pico da barra do rio, ondas rapidas e ocas.', img: 'https://cdn-clubecandeias.s3.sa-east-1.amazonaws.com/uploads/featured_images/imagem_destaque_7083.jpeg' },
  { nome: 'Siriú Norte', slug: 'siriu-norte', descricao: 'Pico norte do Siriú com ondas abertas.', img: 'https://visitegaropaba.tur.br/wp-content/uploads/elementor/thumbs/Praia-do-Siriu-1-scaled-recwgsdkgt97zkisp5e40xksaj7khmdgc59mfwl13s.png' },
  { nome: 'Siriú Meio de Praia', slug: 'siriu-meio', descricao: 'Pico central do Siriú, consistente o ano todo.', img: 'https://static.ndmais.com.br/2023/08/praia-do-siriu-garopaba-5.jpeg' },
  { nome: 'Gamboa', slug: 'gamboa', descricao: 'Praia tranquila com ondas perfeitas para iniciantes.', img: 'https://primeimg2.nyc3.cdn.digitaloceanspaces.com/arquivos/1/162431201910287672198526562.jpg' },
  { nome: 'Ouvidor', slug: 'ouvidor', descricao: 'Spot escondido com ondas de qualidade.', img: 'https://www.garopabaimbituba.tur.br/wp-content/uploads/2021/05/ouvidor-4-e1620216908136.jpg' },
  { nome: 'Praia Central', slug: 'central', descricao: 'A praia mais movimentada de Garopaba.', img: 'https://www.ventosul.com.br/img/garu.jpeg' },
]

function BuscaResultados() {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') || ''

  const resultados = praias.filter(function(p) {
    return p.nome.toLowerCase().includes(q.toLowerCase())
  })

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '100px 16px 60px' }}>
      <h1 className={lexend.className} style={{ fontSize: '28px', color: 'black', letterSpacing: '-0.06em', marginBottom: '8px' }}>
        {q ? 'Resultados para "' + q + '"' : 'Buscar praias'}
      </h1>
      <p className={lexendNormal.className} style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '32px' }}>
        {resultados.length} praia{resultados.length !== 1 ? 's' : ''} encontrada{resultados.length !== 1 ? 's' : ''}
      </p>

      {resultados.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af' }}>
          <p style={{ fontSize: '16px' }}>Nenhuma praia encontrada para "{q}"</p>
          <a href='/praias' style={{ color: 'black', fontWeight: '600', marginTop: '16px', display: 'block' }}>Ver todas as praias</a>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {resultados.map(function(praia) {
          return (
            <a key={praia.slug} href={'/praias/' + praia.slug} style={{ textDecoration: 'none', display: 'flex', gap: '16px', alignItems: 'center', padding: '16px', borderRadius: '16px', border: '1px solid #f3f4f6' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                <img src={praia.img} alt={praia.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <h2 className={lexend.className} style={{ fontSize: '18px', color: 'black', letterSpacing: '-0.04em', marginBottom: '4px' }}>{praia.nome}</h2>
                <p style={{ fontSize: '13px', color: '#6b7280' }}>{praia.descricao}</p>
                <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>Garopaba, Santa Catarina</p>
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}

export default function BuscaPage() {
  return (
    <div className='min-h-screen bg-white'>
      <Navbar />
      <Suspense fallback={<div style={{ padding: '100px 16px' }}>Carregando...</div>}>
        <BuscaResultados />
      </Suspense>
      <Footer />
    </div>
  )
}
