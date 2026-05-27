import { Lexend } from 'next/font/google'
const lexend = Lexend({ subsets: ['latin'], weight: '500' })

export default function Praias() {
  const praias = [
    { nome: 'Silveira Sul', slug: 'silveira-sul', descricao: 'Pico sul do Silveira, famoso por ondas tubulares e consistentes.', img: 'https://cdn.sanity.io/images/we0tdimr/production/724f27b9d80ec98374af7cc4c2e8afc3d3d541d4-1920x1252.jpg' },
    { nome: 'Silveira Norte', slug: 'silveira-norte', descricao: 'Pico norte do Silveira, ondas mais abertas e ideais para manobras.', img: 'https://www.waves.com.br/wp-content/uploads/2018/10/12-Praia-do-silveira-foto-AiltonSouzaPhotography.jpg' },
    { nome: 'Ferrugem Norte', slug: 'ferrugem-norte', descricao: 'Pico norte da Ferrugem com ondas potentes e fundo de areia grossa.', img: 'https://radioestacaogaropaba.com/wp-content/uploads/2026/03/DJI_20260218084656_0125_D-1024x576.jpg' },
    { nome: 'Siriu Meio', slug: 'siriu-meio', descricao: 'Pico central do Siriu, mais acessivel e consistente durante o ano todo.', img: 'https://static.ndmais.com.br/2023/08/praia-do-siriu-garopaba-5.jpeg' },
    { nome: 'Praia Central', slug: 'central', descricao: 'A praia mais movimentada de Garopaba, com aguas calmas e estrutura completa.', img: 'https://www.ventosul.com.br/img/garu.jpeg' },
  ]

  return (
    <section className='w-full py-12 bg-white'>
      <div className='max-w-[70%] mx-auto hidden md:block'>
        <div className='flex items-center justify-between mb-8'>
          <h2 className={lexend.className} style={{ fontSize: '28px', color: 'black', letterSpacing: '-0.06em', WebkitTextStroke: '0.5px black' }}>Praias</h2>
          <a href='/praias' className='px-5 py-2 bg-black text-white border border-black rounded-[10px] text-sm font-medium hover:bg-white hover:text-black transition'>Ver mais</a>
        </div>
        <div className='grid grid-cols-5 gap-4'>
          {praias.map(function(praia) {
            return (
              <a key={praia.slug} href={'/praias/' + praia.slug} className='group cursor-pointer' style={{ textDecoration: 'none' }}>
                <div className='relative overflow-hidden rounded-xl' style={{ height: '200px' }}>
                  <img src={praia.img} alt={praia.nome} className='w-full h-full object-cover group-hover:scale-105 transition duration-500' />
                  <div className='absolute inset-0 bg-black/30 group-hover:bg-black/50 transition' />
                  <div className='absolute bottom-3 left-3'>
                    <h3 className={lexend.className} style={{ fontSize: '16px', color: 'white', fontWeight: '500', letterSpacing: '-0.03em' }}>{praia.nome}</h3>
                  </div>
                </div>
                <p className='text-gray-500 text-xs mt-2 leading-relaxed'>{praia.descricao}</p>
              </a>
            )
          })}
        </div>
      </div>

      <div className='md:hidden px-4'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className={lexend.className} style={{ fontSize: '24px', color: 'black', letterSpacing: '-0.06em', WebkitTextStroke: '0.5px black' }}>Praias</h2>
          <a href='/praias' className='px-4 py-2 bg-black text-white rounded-[10px] text-xs font-medium' style={{ textDecoration: 'none' }}>Ver mais</a>
        </div>
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
          {praias.map(function(praia) {
            return (
              <a key={praia.slug} href={'/praias/' + praia.slug} className='flex-shrink-0 cursor-pointer' style={{ width: '160px', scrollSnapAlign: 'start', textDecoration: 'none' }}>
                <div className='relative overflow-hidden rounded-xl' style={{ width: '160px', height: '160px' }}>
                  <img src={praia.img} alt={praia.nome} className='w-full h-full object-cover' />
                  <div className='absolute inset-0 bg-black/30' />
                  <div className='absolute bottom-3 left-3'>
                    <h3 className={lexend.className} style={{ fontSize: '14px', color: 'white', fontWeight: '500', letterSpacing: '-0.03em' }}>{praia.nome}</h3>
                  </div>
                </div>
                <p className='text-gray-500 text-xs mt-2 leading-relaxed'>{praia.descricao}</p>
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
