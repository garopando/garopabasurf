'use client'
import { Lexend } from 'next/font/google'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import NextImage from 'next/image'

const lexend = Lexend({ subsets: ['latin'], weight: '700' })

const praias = [
  { slug: 'silveira-sul', nome: 'Silveira Sul', descricao: 'Pico sul da Praia do Silveira, famoso por ondas tubulares e consistentes com swell de sul.', img: 'https://cdn.sanity.io/images/we0tdimr/production/724f27b9d80ec98374af7cc4c2e8afc3d3d541d4-1920x1252.jpg' },
  { slug: 'silveira-norte', nome: 'Silveira Norte', descricao: 'Pico norte do Silveira, ondas mais abertas e ideais para manobras.', img: 'https://www.waves.com.br/wp-content/uploads/2018/10/12-Praia-do-silveira-foto-AiltonSouzaPhotography.jpg' },
  { slug: 'ferrugem-norte', nome: 'Ferrugem Norte', descricao: 'Pico norte da Ferrugem com ondas potentes e fundo de areia grossa.', img: 'https://radioestacaogaropaba.com/wp-content/uploads/2026/03/DJI_20260218084656_0125_D-1024x576.jpg' },
  { slug: 'ferrugem-sul', nome: 'Ferrugem Sul', descricao: 'Pico sul da Ferrugem, mais protegido do vento norte e com ondas regulares.', img: 'https://www.waves.com.br/wp-content/uploads/2020/11/Bernardo-Villanueva-Praia-da-ferrugem-2-1024x683.jpg' },
  { slug: 'barra', nome: 'Barra', descricao: 'Pico da barra do rio, ondas rapidas e ocas, spot favorito dos locais.', img: 'https://cdn-clubecandeias.s3.sa-east-1.amazonaws.com/uploads/featured_images/imagem_destaque_7083.jpeg' },
  { slug: 'siriu-norte', nome: 'Siriú Norte', descricao: 'Pico norte do Siriu com ondas abertas e ideais para manobras.', img: 'https://visitegaropaba.tur.br/wp-content/uploads/elementor/thumbs/Praia-do-Siriu-1-scaled-recwgsdkgt97zkisp5e40xksaj7khmdgc59mfwl13s.png' },
  { slug: 'siriu-meio', nome: 'Siriú - Meio de Praia', descricao: 'Pico central do Siriu, mais acessivel e consistente durante o ano todo.', img: 'https://static.ndmais.com.br/2023/08/praia-do-siriu-garopaba-5.jpeg' },
  { slug: 'gamboa', nome: 'Gamboa', descricao: 'Praia tranquila com ondas perfeitas para iniciantes e longboarders.', img: 'https://primeimg2.nyc3.cdn.digitaloceanspaces.com/arquivos/1/162431201910287672198526562.jpg' },
  { slug: 'ouvidor', nome: 'Ouvidor', descricao: 'Spot escondido com ondas de qualidade e poucos surfistas na agua.', img: 'https://www.garopabaimbituba.tur.br/wp-content/uploads/2021/05/ouvidor-4-e1620216908136.jpg' },
  { slug: 'central', nome: 'Praia Central', descricao: 'A praia mais movimentada de Garopaba, com aguas calmas e estrutura completa.', img: 'https://www.ventosul.com.br/img/garu.jpeg' },
]

export default function PraiasPage() {
  return (
    <div className='min-h-screen bg-white'>
      <Navbar />

      <div className='hidden md:block max-w-[70%] mx-auto pt-28 pb-16'>
        <h1 className={lexend.className} style={{ fontSize: '40px', fontWeight: '700', letterSpacing: '-0.06em', marginBottom: '8px', color: 'black', WebkitTextStroke: '0.5px black' }}>Praias</h1>
        <p className='text-gray-500 text-base mb-10'>Escolha uma praia para ver a previsão de ondas.</p>
        <div className='grid grid-cols-3 gap-6'>
          {praias.map(function(praia) {
            return (
              <a key={praia.slug} href={'/praias/' + praia.slug} className='group cursor-pointer' style={{ textDecoration: 'none' }}>
                <div className='relative overflow-hidden rounded-xl' style={{ height: '200px' }}>
                  <NextImage src={praia.img} alt={praia.nome} fill style={{ objectFit: 'cover' }} className='group-hover:scale-105 transition duration-500' />
                  <div className='absolute inset-0 bg-black/30 group-hover:bg-black/50 transition' />
                  <div className='absolute bottom-4 left-4'>
                    <h3 className={lexend.className} style={{ fontSize: '20px', fontWeight: '700', color: 'white', letterSpacing: '-0.02em' }}>{praia.nome}</h3>
                  </div>
                </div>
                <p className='text-gray-500 text-sm mt-3 leading-relaxed'>{praia.descricao}</p>
              </a>
            )
          })}
        </div>
      </div>

      <div className='md:hidden pt-20 pb-24'>
        <div className='px-4 mb-6'>
          <h1 className={lexend.className} style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.06em', color: 'black', WebkitTextStroke: '0.5px black' }}>Praias</h1>
          <p className='text-gray-500 text-sm mt-1'>Escolha uma praia para ver a previsao de ondas.</p>
        </div>
        <div className='flex flex-col gap-4 px-4'>
          {praias.map(function(praia) {
            return (
              <a key={praia.slug} href={'/praias/' + praia.slug} className='group' style={{ textDecoration: 'none', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div className='relative overflow-hidden rounded-xl flex-shrink-0' style={{ width: '90px', height: '90px', position: 'relative' }}>
                  <NextImage src={praia.img} alt={praia.nome} fill style={{ objectFit: 'cover' }} />
                  <div className='absolute inset-0 bg-black/20' />
                </div>
                <div>
                  <h3 className={lexend.className} style={{ fontSize: '16px', fontWeight: '700', color: 'black', letterSpacing: '-0.03em', marginBottom: '4px' }}>{praia.nome}</h3>
                  <p style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.4' }}>{praia.descricao}</p>
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
