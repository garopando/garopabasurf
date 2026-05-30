import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./components/AuthContext";
import AuthModal from "./components/AuthModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "GaropabaSurf - Previsão de ondas em Garopaba",
  description: "A melhor previsão de ondas de Garopaba, Silveira, Ferrugem, Siriú, Gamboa e região. Altura, período, direção, vento e marés em tempo real para surfistas de Santa Catarina.",
  keywords: [
    "previsao de ondas Garopaba",
    "surf Garopaba",
    "ondas Garopaba hoje",
    "Praia do Silveira",
    "Praia da Ferrugem",
    "Praia do Siriú",
    "Gamboa surf",
    "surf Santa Catarina",
    "previsao surf SC",
    "ondas Silveira Sul",
    "ondas Ferrugem Norte",
    "surf Garopaba hoje",
    "previsao ondas Santa Catarina",
    "praias Garopaba",
    "esportes Garopaba",
    "surf Brasil",
    "ondas Brasil",
    "swell sul",
    "surf litoral sul",
    "Garopaba Santa Catarina",
    "melhores praias Garopaba",
    "surf iniciante Garopaba",
    "ondas perfeitas SC",
    "altura das ondas Garopaba",
    "vento Garopaba",
    "mares Garopaba",
    "previsao tempo Garopaba",
    "turismo Garopaba",
    "viagem Garopaba",
    "o que fazer em Garopaba",
    "Garopaba surf trip",
    "swell Garopaba",
    "ondas perfeitas Garopaba",
    "surfistas Garopaba",
    "esportes aquaticos Garopaba",
    "beach life Garopaba",
    "verao Garopaba",
    "temporada surf SC",
  ],
  authors: [{ name: "GaropabaSurf", url: "https://garopabasurf.app" }],
  creator: "GaropabaSurf",
  publisher: "GaropabaSurf",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://garopabasurf.app",
    siteName: "GaropabaSurf",
    title: "GaropabaSurf - Previsao de Ondas em Garopaba e Regiao",
    description: "A melhor previsão de ondas de Garopaba, Silveira, Ferrugem, Siriú, Gamboa e região. Dados em tempo real para surfistas de Santa Catarina.",
    images: [
      {
        url: "https://www.waves.com.br/wp-content/uploads/2018/10/13-Praia-do-Silveira-foto-Ailton-Souza-photography.jpg",
        width: 1200,
        height: 630,
        alt: "Praia do Silveira - Garopaba - GaropabaSurf",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GaropabaSurf - Previsao de Ondas em Garopaba",
    description: "A melhor previsão de ondas de Garopaba e região. Silveira, Ferrugem, Siriú, Gamboa e mais.",
    images: ["https://www.waves.com.br/wp-content/uploads/2018/10/13-Praia-do-Silveira-foto-Ailton-Souza-photography.jpg"],
    creator: "@garopabasurf",
  },
  alternates: {
    canonical: "https://garopabasurf.app",
  },
  category: "sports",
  referrer: "origin-when-cross-origin",
  other: {
    "geo.region": "BR-SC",
    "geo.placename": "Garopaba, Santa Catarina, Brasil",
    "geo.position": "-28.0449;-48.6073",
    "ICBM": "-28.0449, -48.6073",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="pt-BR"
      className={geistSans.variable + " " + geistMono.variable + " h-full antialiased"}
    >
      <head>
        <link rel="canonical" href="https://garopabasurf.app" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-LH0EBFD9PT"></script>
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-LH0EBFD9PT');
        ` }} />
        <meta name="google-site-verification" content="jGiXrZwc3_8RcX1bxJOo_1OKDF6gIvIuCZmudV1hFCI" />
        <meta name="theme-color" content="#000000" />
        <meta name="application-name" content="GaropabaSurf" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="GaropabaSurf" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "GaropabaSurf",
              "url": "https://garopabasurf.app",
              "description": "Previsão de ondas em Garopaba e região - Silveira, Ferrugem, Siriú, Gamboa",
              "inLanguage": "pt-BR",
              "publisher": {
                "@type": "Organization",
                "name": "GaropabaSurf",
                "url": "https://garopabasurf.app",
                "sameAs": [
                  "https://instagram.com/garopabasurf"
                ]
              },
              "about": {
                "@type": "Place",
                "name": "Garopaba",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Garopaba",
                  "addressRegion": "Santa Catarina",
                  "addressCountry": "BR"
                },
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": -28.0449,
                  "longitude": -48.6073
                }
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://garopabasurf.app/praias?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className="min-h-full flex flex-col"><AuthProvider>{children}<AuthModal /></AuthProvider></body>
    </html>
  );
}
