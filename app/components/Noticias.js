import { Lexend } from 'next/font/google'
const lexend = Lexend({ subsets: ['latin'], weight: '500' })

const noticias = [
  { id: 1, titulo: 'Ondas de 2m animam surfistas no Silveira', img: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80', tamanho: 'grande' },
  { id: 2, titulo: 'Campeonato regional de surf agita Garopaba em julho', img: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80', tamanho: 'grande' },
  { id: 3, titulo: 'Siriu recebe swell do sul com ondas acima de 3m', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', tamanho: 'pequeno' },
  { id: 4, titulo: 'Ferrugem tem as melhores condições da temporada', img: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80', tamanho: 'pequeno' },
  { id: 5, titulo: 'Previsão indica semana perfeita para o surf', img: 'https://images.unsplash.com/photo-1455264745730-cb3b76250827?w=800&q=80', tamanho: 'pequeno' },
]

function CardNoticia({ noticia, altura }) {
  return (
    <a href='#' className='relative overflow-hidden rounded-xl flex items-end cursor-pointer group'
      style={{ backgroundImage: 'url(' + noticia.img + ')', backgroundSize: 'cover', backgroundPosition: 'center', minHeight: altura }}>
      <div className='absolute inset-0 bg-black/50 group-hover:bg-black/60 transition' />
      <div className='relative z-10 p-4'>
        <h3 className={lexend.className} style={{ fontSize: '22px', color: 'white', fontWeight: '500', letterSpacing: '-0.03em', lineHeight: '1.2' }}>{noticia.titulo}</h3>
      </div>
    </a>
  )
}

export default function Noticias() {
  const grandes = noticias.filter(function(n) { return n.tamanho === 'grande' })
  const pequenas = noticias.filter(function(n) { return n.tamanho === 'pequeno' })

  return (
    <section className='w-full py-10'>
      <div className='max-w-[70%] mx-auto hidden md:block'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className={lexend.className} style={{ fontSize: '28px', color: 'black', letterSpacing: '-0.06em', WebkitTextStroke: '0.5px black' }}>Notícias</h2>
          <a href='#' className='px-5 py-2 bg-black text-white border border-black rounded-[10px] text-sm font-medium hover:bg-white hover:text-black transition'>Ver mais</a>
        </div>
        <div className='grid grid-cols-2 gap-3 mb-3'>
          {grandes.map(function(n) { return <CardNoticia key={n.id} noticia={n} altura='280px' /> })}
        </div>
        <div className='grid grid-cols-3 gap-3'>
          {pequenas.map(function(n) { return <CardNoticia key={n.id} noticia={n} altura='180px' /> })}
        </div>
      </div>

      <div className='md:hidden'>
        <div className='flex items-center justify-between mb-4 px-4'>
          <h2 className={lexend.className} style={{ fontSize: '24px', color: 'black', letterSpacing: '-0.06em', WebkitTextStroke: '0.5px black' }}>Notícias</h2>
          <a href='#' className='px-4 py-2 bg-black text-white rounded-[10px] text-xs font-medium'>Ver mais</a>
        </div>
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingLeft: '16px', paddingRight: '16px', paddingBottom: '8px', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
          {noticias.map(function(n) {
            return (
              <a key={n.id} href='#' className='relative overflow-hidden rounded-xl flex items-end cursor-pointer flex-shrink-0'
                style={{ backgroundImage: 'url(' + n.img + ')', backgroundSize: 'cover', backgroundPosition: 'center', width: '160px', height: '160px', scrollSnapAlign: 'start', textDecoration: 'none' }}>
                <div className='absolute inset-0 bg-black/50' />
                <div className='relative z-10 p-3'>
                  <h3 className={lexend.className} style={{ fontSize: '12px', color: 'white', fontWeight: '500', letterSpacing: '-0.02em', lineHeight: '1.3' }}>{n.titulo}</h3>
                </div>
              </a>
            )
          })}
        </div>
        <div className='flex justify-center mt-3 gap-1'>
          <div style={{ width: '24px', height: '3px', borderRadius: '2px', background: 'black' }} />
          <div style={{ width: '8px', height: '3px', borderRadius: '2px', background: '#d1d5db' }} />
          <div style={{ width: '8px', height: '3px', borderRadius: '2px', background: '#d1d5db' }} />
        </div>
      </div>
    </section>
  )
}
