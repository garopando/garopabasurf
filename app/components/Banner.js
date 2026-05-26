export default function Banner() {
  return (
    <section className='w-full py-6'>
      <div className='md:max-w-[70%] md:mx-auto md:px-0 px-4'>
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
