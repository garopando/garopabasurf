'use client'
import { Lexend } from 'next/font/google'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const lexend = Lexend({ subsets: ['latin'], weight: '700' })

export default function Termos() {
  return (
    <div className='min-h-screen bg-white'>
      <Navbar />
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '110px 20px 70px' }} className='pagina-legal'>
        <h1 className={lexend.className} style={{ fontSize: '34px', fontWeight: '700', letterSpacing: '-0.06em', color: '#111', marginBottom: '8px' }}>Termos de Uso</h1>
        <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '36px' }}>Última atualização: 31 de maio de 2026</p>

        <p>Bem-vindo ao GaropabaSurf. Ao acessar e utilizar este site, você concorda com os termos descritos abaixo. Leia com atenção.</p>

        <h2>1. Sobre o site</h2>
        <p>O GaropabaSurf é um portal que oferece previsões de ondas, informações sobre as praias de Garopaba e região, e conteúdo sobre surf. As informações têm caráter informativo.</p>

        <h2>2. Previsões e informações</h2>
        <p>As previsões de ondas, vento e marés são geradas a partir de fontes de dados meteorológicos e oceanográficos de terceiros. Apesar de buscarmos a maior precisão possível, previsões são estimativas e podem não corresponder às condições reais do mar. O GaropabaSurf não se responsabiliza por decisões tomadas com base nessas informações. A prática do surf e de atividades no mar é de responsabilidade exclusiva do usuário, que deve sempre avaliar as condições locais e respeitar seus próprios limites e a sinalização das praias.</p>

        <h2>3. Cadastro e conta</h2>
        <p>Ao criar uma conta, você se compromete a fornecer informações verdadeiras e a manter a confidencialidade da sua senha. Você é responsável pelas atividades realizadas na sua conta.</p>

        <h2>4. Uso adequado</h2>
        <p>Você concorda em não utilizar o site para fins ilícitos, não tentar acessar áreas restritas sem autorização, e não realizar ações que possam prejudicar o funcionamento do site ou outros usuários.</p>

        <h2>5. Conteúdo e propriedade intelectual</h2>
        <p>O conteúdo produzido pelo GaropabaSurf (textos, layout, marca) é protegido. Conteúdos de terceiros eventualmente exibidos pertencem aos seus respectivos autores.</p>

        <h2>6. Limitação de responsabilidade</h2>
        <p>O site é oferecido "como está". Não garantimos disponibilidade ininterrupta nem ausência de erros. Não nos responsabilizamos por eventuais prejuízos decorrentes do uso ou da indisponibilidade do serviço.</p>

        <h2>7. Alterações nos termos</h2>
        <p>Estes termos podem ser modificados a qualquer momento. O uso continuado do site após alterações representa concordância com os novos termos.</p>

        <h2>8. Contato</h2>
        <p>Em caso de dúvidas sobre estes termos, entre em contato pelo e-mail: contato@garopabasurf.app</p>
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
