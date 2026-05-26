export default function WebStories() {
  const stories = [
    { id: 1, titulo: 'Silveira bombando', img: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=400&q=80' },
    { id: 2, titulo: 'Swell chegando', img: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&q=80' },
    { id: 3, titulo: 'Ferrugem perfeita', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80' },
    { id: 4, titulo: 'Melhores picos', img: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&q=80' },
    { id: 5, titulo: 'Fim de semana epic', img: 'https://images.unsplash.com/photo-1455264745730-cb3b76250827?w=400&q=80' },
    { id: 6, titulo: 'Siriu on fire', img: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=400&q=80' },
    { id: 7, titulo: 'Gamboa tubos', img: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=400&q=80' },
    { id: 8, titulo: 'Verao chegando', img: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&q=80' },
  ]

  return (
    <section className='w-full py-10 bg-gray-100'>
      <div className='max-w-[70%] mx-auto'>
        <h2 className='text-2xl font-bold text-black mb-6' style={{ letterSpacing: '-0.06em' }}>Stories</h2>
        <div className='flex gap-4 overflow-x-auto pb-3' style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {stories.map(function(story) {
            return (
              <a href='#' key={story.id} className='relative flex-shrink-0 overflow-hidden rounded-2xl group cursor-pointer' style={{ width: '130px', height: '210px' }}>
                <img src={story.img} alt={story.titulo} className='w-full h-full object-cover group-hover:scale-105 transition duration-500' />
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent' />
                <div className='absolute bottom-0 left-0 right-0 p-3'>
                  <p className='text-white text-xs font-bold leading-tight'>{story.titulo}</p>
                </div>
                <div className='absolute inset-0 rounded-2xl border-2 border-white/20 group-hover:border-white/60 transition' />
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
