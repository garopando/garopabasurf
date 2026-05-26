import { Lexend } from 'next/font/google'
const lexend = Lexend({ subsets: ['latin'], weight: '500' })
export default function Praias() {
  const praias = [
    {
      nome: 'Silveira',
      descricao: 'Uma das praias mais famosas de Garopaba, conhecida pelas ondas perfeitas para o surf.',
      img: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80',
    },
    {
      nome: 'Ferrugem',
      descricao: 'Praia selvagem com ondas potentes, preferida pelos surfistas mais experientes da regiao.',
      img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    },
    {
      nome: 'Central',
      descricao: 'A praia mais movimentada de Garopaba, com aguas calmas e estrutura completa para todos.',
      img: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80',
    },
  ]

  return (
    <section className='w-full py-12 bg-white'>
      <div className='max-w-[70%] mx-auto'>
        <div className='flex items-center justify-between mb-8'>
          <h2 className={lexend.className} style={{ fontSize: '28px', letterSpacing: '-0.06em', color: 'black', WebkitTextStroke: '0.5px black' }}>Praias</h2>
          <a href='#' className='px-5 py-2 bg-black text-white border border-black rounded-[10px] text-sm font-medium hover:bg-white hover:text-black transition'>Ver mais</a>
        </div>
        <div className='grid grid-cols-3 gap-4'>
          {praias.map(function(praia) {
            return (
              <a key={praia.nome} href='#' className='group cursor-pointer'>
                <div className='relative overflow-hidden rounded-xl' style={{ height: '220px' }}>
                  <img
                    src={praia.img}
                    alt={praia.nome}
                    className='w-full h-full object-cover group-hover:scale-105 transition duration-500'
                  />
                  <div className='absolute inset-0 bg-black/30 group-hover:bg-black/50 transition' />
                  <div className='absolute bottom-4 left-4'>
                    <h3 className={lexend.className} style={{ fontSize: '24px', color: 'white', fontWeight: '700', letterSpacing: '-0.03em' }}>{praia.nome}</h3>
                  </div>
                </div>
                <p className='text-gray-500 text-sm mt-3 leading-relaxed'>{praia.descricao}</p>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
