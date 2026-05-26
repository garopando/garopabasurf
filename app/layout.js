import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "GaropabaSurf - Previsão de Ondas em Garopaba e Região",
  description: "A melhor previsão de ondas de Garopaba, Silveira, Ferrugem, Siriú, Gamboa e região. Altura, período, direção, vento e marés em tempo real para surfistas de Santa Catarina.",
  keywords: [
    "previsão de ondas Garopaba",
    "surf Garopaba",
    "ondas Garopaba hoje",
    "Praia do Silveira",
    "Praia da Ferrugem",
    "Praia do Siriú",
    "Gamboa surf",
    "surf Santa Catarina",
    "previsão surf SC",
    "ondas Silveira Sul",
    "ondas Ferrugem Norte",
    "surf Garopaba hoje",
    "previsão ondas Santa Catarina",
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
    "marés Garopaba",
  ],
  authors: [{ name: "GaropabaSurf", url: "https://garopabasurf.vercel.app" }],
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
    url: "https://garopabasurf.vercel.app",
    siteName: "GaropabaSurf",
    title: "GaropabaSurf - Previsão de Ondas em Garopaba e Região",
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
    title: "GaropabaSurf - Previsão de Ondas em Garopaba",
    description: "A melhor previsão de ondas de Garopaba e região. Silveira, Ferrugem, Siriú, Gamboa e mais.",
    images: ["https://www.waves.com.br/wp-content/uploads/2018/10/13-Praia-do-Silveira-foto-Ailton-Souza-photography.jpg"],
    creator: "@garopabasurf",
  },
  alternates: {
    canonical: "https://garopabasurf.vercel.app",
  },
  category: "sports",
  classification: "Surf, Esportes, Previsão do Tempo",
  referrer: "origin-when-cross-origin",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: "",
  },
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
        <link rel="canonical" href="https://garopabasurf.vercel.app" />
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
              "url": "https://garopabasurf.vercel.app",
              "description": "Previsão de ondas em Garopaba e região - Silveira, Ferrugem, Siriú, Gamboa",
              "inLanguage": "pt-BR",
              "publisher": {
                "@type": "Organization",
                "name": "GaropabaSurf",
                "url": "https://garopabasurf.vercel.app",
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
                "target": "https://garopabasurf.vercel.app/praias?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
