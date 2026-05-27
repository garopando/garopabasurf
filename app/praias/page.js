import { Lexend } from 'next/font/google'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const lexend = Lexend({ subsets: ['latin'], weight: '700' })

const praias = [
  { slug: 'silveira-sul', nome: 'Silveira Sul', descricao: 'Pico sul da Praia do Silveira, famoso por ondas tubulares e consistentes com swell de sul.', img: 'https://cdn.sanity.io/images/we0tdimr/production/724f27b9d80ec98374af7cc4c2e8afc3d3d541d4-1920x1252.jpg' },
  { slug: 'silveira-norte', nome: 'Silveira Norte', descricao: 'Pico norte do Silveira, ondas mais abertas e ideais para manobras.', img: 'https://www.waves.com.br/wp-content/uploads/2018/10/12-Praia-do-silveira-foto-AiltonSouzaPhotography.jpg' },
  { slug: 'ferrugem-norte', nome: 'Ferrugem Norte', descricao: 'Pico norte da Ferrugem com ondas potentes e fundo de areia grossa.', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80' },
  { slug: 'ferrugem-sul', nome: 'Ferrugem Sul', descricao: 'Pico sul da Ferrugem, mais protegido do vento norte e com ondas regulares.', img: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80' },
  { slug: 'barra', nome: 'Barra', descricao: 'Pico da barra do rio, ondas rápidas e ocas, spot favorito dos locais.', img: 'https://images.unsplash.com/photo-1455264745730-cb3b76250827?w=800&q=80' },
  { slug: 'siriu-sul', nome: 'Siriú Sul', descricao: 'Pico sul do Siriú, ondas poderosas e longas, ideal para dias de swell grande.', img: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800&q=80' },
  { slug: 'siriu-meio', nome: 'Siriú Meio de Praia', descricao: 'Pico central do Siriú, mais acessível e consistente durante o ano todo.', img: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80' },
  { slug: 'gamboa', nome: 'Gamboa', descricao: 'Praia tranquila com ondas perfeitas para iniciantes e longboarders.', img: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80' },
  { slug: 'ouvidor', nome: 'Ouvidor', descricao: 'Spot escondido com ondas de qualidade e poucos surfistas na água.', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80' },
]

export default function PraiasPage() {
  return (
    <div className='min-h-screen bg-white'>
      <Navbar />
      <div className='max-w-[70%] mx-auto pt-28 pb-16'>
        <h1 className={lexend.className} style={{ fontSize: '40px', fontWeight: '700', letterSpacing: '-0.06em', marginBottom: '8px', color: 'black', WebkitTextStroke: '0.5px black' }}>Praias</h1>
        <p className='text-gray-500 text-base mb-10'>Escolha uma praia para ver a previsao de ondas.</p>
        <div className='grid grid-cols-3 gap-6'>
          {praias.map(function(praia) {
            return (
              <a key={praia.slug} href={'/praias/' + praia.slug} className='group cursor-pointer'>
                <div className='relative overflow-hidden rounded-xl' style={{ height: '200px' }}>
                  <img
                    src={praia.img}
                    alt={praia.nome}
                    className='w-full h-full object-cover group-hover:scale-105 transition duration-500'
                  />
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
      <Footer />
    </div>
  )
}
