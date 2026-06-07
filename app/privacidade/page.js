'use client'
import { Lexend } from 'next/font/google'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const lexend = Lexend({ subsets: ['latin'], weight: '700' })

export default function Privacidade() {
  return (
    <div className='min-h-screen bg-white'>
      <Navbar />
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '110px 20px 70px' }} className='pagina-legal'>
        <h1 className={lexend.className} style={{ fontSize: '34px', fontWeight: '700', letterSpacing: '-0.06em', color: '#111', marginBottom: '8px' }}>Política de Privacidade</h1>
        <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '36px' }}>Última atualização: 31 de maio de 2026</p>

        <p>O GaropabaSurf valoriza a privacidade dos seus visitantes e usuários. Esta Política de Privacidade explica quais dados coletamos, como os utilizamos e quais são os seus direitos, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD).</p>

        <h2>1. Quais dados coletamos</h2>
        <p>Coletamos apenas os dados necessários para o funcionamento do site:</p>
        <p><strong>Dados de cadastro:</strong> ao criar uma conta, coletamos seu nome e endereço de e-mail. A senha é armazenada de forma criptografada e não temos acesso a ela.</p>
        <p><strong>Dados de uso:</strong> praias que você marca como favoritas ficam associadas à sua conta.</p>
        <p><strong>Newsletter:</strong> caso se inscreva, coletamos seu e-mail para envio de novidades.</p>
        <p><strong>Dados de navegação:</strong> coletamos informações anônimas de uso através de ferramentas de análise (como o Google Analytics), tais como páginas visitadas e tempo de permanência.</p>

        <h2>2. Como utilizamos seus dados</h2>
        <p>Utilizamos seus dados para permitir o acesso à sua conta, salvar suas praias favoritas, enviar comunicações que você solicitou (newsletter) e melhorar a experiência no site. Não vendemos nem compartilhamos seus dados pessoais com terceiros para fins comerciais.</p>

        <h2>3. Armazenamento e segurança</h2>
        <p>Seus dados são armazenados em servidores seguros (Supabase) com medidas de proteção e controle de acesso. Adotamos práticas de segurança para proteger suas informações contra acesso não autorizado.</p>

        <h2>4. Seus direitos</h2>
        <p>De acordo com a LGPD, você pode solicitar a qualquer momento o acesso, a correção ou a exclusão dos seus dados pessoais, bem como revogar o consentimento para o uso deles. Para isso, entre em contato pelo e-mail abaixo.</p>

        <h2>5. Cookies</h2>
        <p>Utilizamos cookies para melhorar a navegação e analisar o uso do site. Para mais detalhes, consulte nossa Política de Cookies.</p>

        <h2>6. Alterações nesta política</h2>
        <p>Esta política pode ser atualizada periodicamente. Recomendamos que você a consulte de tempos em tempos.</p>

        <h2>7. Contato</h2>
        <p>Para dúvidas ou solicitações relacionadas aos seus dados, entre em contato pelo e-mail: contato@garopabasurf.app</p>
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
