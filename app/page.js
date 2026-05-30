import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Praias from './components/Praias'
import Noticias from './components/Noticias'
import Newsletter from './components/Newsletter'
import Footer from './components/Footer'

export default function Home() {
  return (
    <div className='min-h-screen bg-white'>
      <div className='hidden md:block max-w-[70%] mx-auto'>
        <Navbar />
      </div>
      <div className='md:hidden'>
        <Navbar />
      </div>
      <Hero />
      <Praias />
      <Noticias />
      <Newsletter />
      <Footer />
    </div>
  )
}
