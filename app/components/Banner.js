export default function Banner() {
  return (
    <section className='w-full py-6'>
      <div className='max-w-[70%] mx-auto px-4 md:px-0'>
        <div className='relative w-full overflow-hidden rounded-xl' style={{ height: '100px' }}>
          <img
            src='https://i.ibb.co/Cpb7N3R1/158221673-10624617.jpg'
            alt='banner'
            className='w-full h-full object-cover'
          />
        </div>
      </div>
    </section>
  )
}
