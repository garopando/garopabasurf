'use client'
import { Lexend } from 'next/font/google'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const lexend = Lexend({ subsets: ['latin'], weight: '700' })

export default function Cookies() {
  return (
    <div className='min-h-screen bg-white'>
      <Navbar />
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '110px 20px 70px' }} className='pagina-legal'>
        <h1 className={lexend.className} style={{ fontSize: '34px', fontWeight: '700', letterSpacing: '-0.06em', color: '#111', marginBottom: '8px' }}>Política de Cookies</h1>
        <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '36px' }}>Última atualização: 31 de maio de 2026</p>

        <p>Esta Política de Cookies explica o que são cookies, como o GaropabaSurf os utiliza e como você pode gerenciá-los.</p>

        <h2>1. O que são cookies</h2>
        <p>Cookies são pequenos arquivos de texto armazenados no seu navegador quando você visita um site. Eles permitem que o site lembre de informações sobre a sua visita, tornando a navegação mais útil e eficiente.</p>

        <h2>2. Como utilizamos cookies</h2>
        <p><strong>Cookies essenciais:</strong> necessários para o funcionamento do site, como manter você conectado à sua conta após o login.</p>
        <p><strong>Cookies de análise:</strong> usamos ferramentas como o Google Analytics para entender como os visitantes usam o site (páginas mais acessadas, tempo de permanência). Esses dados são anônimos e nos ajudam a melhorar o portal.</p>

        <h2>3. Cookies de terceiros</h2>
        <p>Algumas funcionalidades podem utilizar serviços de terceiros que definem seus próprios cookies, como o Google (Analytics) e conteúdos incorporados (por exemplo, publicações do Instagram). Esses cookies são regidos pelas políticas de privacidade dos respectivos serviços.</p>

        <h2>4. Como gerenciar cookies</h2>
        <p>Você pode controlar e excluir cookies através das configurações do seu navegador. A maioria dos navegadores permite bloquear ou apagar cookies. Note que desativar certos cookies pode afetar o funcionamento de algumas partes do site, como o login.</p>

        <h2>5. Alterações</h2>
        <p>Esta política pode ser atualizada periodicamente. Recomendamos consultá-la de tempos em tempos.</p>

        <h2>6. Contato</h2>
        <p>Para dúvidas sobre o uso de cookies, entre em contato pelo e-mail: contato@garopabasurf.app</p>
      </div>
      <Footer />
      <style>{`
        .pagina-legal p { font-size: 15px; line-height: 1.75; color: #374151; margin-bottom: 16px; }
        .pagina-legal h2 { font-size: 19px; font-weight: 700; color: #111; letter-spacing: -0.03em; margin: 32px 0 12px; }
        .pagina-legal strong { color: #111; font-weight: 600; }
      `}</style>
    </div>
  )
}
