'use client'
import { Lexend } from 'next/font/google'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import NextImage from 'next/image'

const lexend = Lexend({ subsets: ['latin'], weight: '700' })

const praias = [
  { slug: 'silveira-sul', nome: 'Silveira Sul', descricao: 'Pico sul da Praia do Silveira, famoso por ondas tubulares e consistentes com swell de sul.', lat: -28.044575, lon: -48.608818 },
  { slug: 'silveira-norte', nome: 'Silveira Norte', descricao: 'Pico norte do Silveira, ondas mais abertas e ideais para manobras.', lat: -28.035384, lon: -48.603403 },
  { slug: 'ferrugem-norte', nome: 'Ferrugem Norte', descricao: 'Pico norte da Ferrugem com ondas potentes e fundo de areia grossa.', lat: -28.075091, lon: -48.624343 },
  { slug: 'ferrugem-sul', nome: 'Ferrugem Sul', descricao: 'Pico sul da Ferrugem, mais protegido do vento norte e com ondas regulares.', lat: -28.081375, lon: -48.627925 },
  { slug: 'barra', nome: 'Barra', descricao: 'Pico da barra do rio, ondas rapidas e ocas, spot favorito dos locais.', lat: -28.086159, lon: -48.630842 },
  { slug: 'siriu-norte', nome: 'Siriú Norte', descricao: 'Pico norte do Siriu com ondas abertas e ideais para manobras.', lat: -27.974714, lon: -48.627251 },
  { slug: 'siriu-meio', nome: 'Siriú - Meio de Praia', descricao: 'Pico central do Siriu, mais acessivel e consistente durante o ano todo.', lat: -27.990017, lon: -48.630352 },
  { slug: 'gamboa', nome: 'Gamboa', descricao: 'Praia tranquila com ondas perfeitas para iniciantes e longboarders.', lat: -27.959332, lon: -48.624417 },
  { slug: 'ouvidor', nome: 'Ouvidor', descricao: 'Spot escondido com ondas de qualidade e poucos surfistas na agua.', lat: -28.105132, lon: -48.635622 },
  { slug: 'central', nome: 'Praia Central', descricao: 'A praia mais movimentada de Garopaba, com aguas calmas e estrutura completa.', lat: -28.017217, lon: -48.624413 },
]

function getMapUrl(lat, lon, zoom, w, h) {
  return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox=' + (lon-0.008) + ',' + (lat-0.004) + ',' + (lon+0.008) + ',' + (lat+0.004) + '&bboxSR=4326&imageSR=4326&size=' + w + ',' + h + '&f=image'
}

export default function PraiasPage() {
  return (
    <div className='min-h-screen bg-white'>
      <Navbar />

      <div className='hidden md:block max-w-[70%] mx-auto pt-28 pb-16'>
        <h1 className={lexend.className} style={{ fontSize: '40px', fontWeight: '700', letterSpacing: '-0.06em', marginBottom: '8px', color: 'black', WebkitTextStroke: '0.5px black' }}>Praias</h1>
        <p className='text-gray-500 text-base mb-10'>Escolha uma praia para ver a previsão de ondas.</p>
        <div className='grid grid-cols-2 gap-6'>
          {praias.map(function(praia) {
            return (
              <a key={praia.slug} href={'/praias/' + praia.slug} className='group cursor-pointer' style={{ textDecoration: 'none' }}>
                <div className='relative overflow-hidden rounded-xl' style={{ height: '200px' }}>
                  <img src={getMapUrl(praia.lat, praia.lon, 15, 400, 200)} alt={praia.nome} className='w-full h-full object-cover group-hover:scale-105 transition duration-500' style={{ position: 'absolute', inset: 0 }} />
                  <div className='absolute inset-0 bg-black/30 group-hover:bg-black/50 transition' />
                  <div className='absolute bottom-4 left-4'>
                    <h3 className={lexend.className} style={{ fontSize: '20px', fontWeight: '700', color: 'white', letterSpacing: '-0.02em' }}>{praia.nome}</h3>
                  </div>
                </div>

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
                  <img src={getMapUrl(praia.lat, praia.lon, 15, 200, 200)} alt={praia.nome} className='w-full h-full object-cover' style={{ position: 'absolute', inset: 0 }} />
                  <div className='absolute inset-0 bg-black/20' />
                </div>
                <div>
                  <h3 className={lexend.className} style={{ fontSize: '16px', fontWeight: '700', color: 'black', letterSpacing: '-0.03em', marginBottom: '4px' }}>{praia.nome}</h3>

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
