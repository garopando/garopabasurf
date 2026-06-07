import Parser from 'rss-parser'

const parser = new Parser({ timeout: 8000 })

const FEEDS = [
  { nome: 'Waves', url: 'https://www.waves.com.br/feed/' },
  { nome: 'Hardcore', url: 'https://www.revistahardcore.com.br/feed' },
  { nome: 'Surfer', url: 'https://www.surfer.com/feed' },
  { nome: 'Stab', url: 'https://stabmag.com/feed/' },
  { nome: 'Surfline', url: 'https://www.surfline.com/rss' },
  { nome: 'BeachGrit', url: 'https://beachgrit.com/feed/' },
]

export async function GET() {
  const resultados = await Promise.all(FEEDS.map(async function(f) {
    try {
      const feed = await parser.parseURL(f.url)
      return (feed.items || []).slice(0, 8).map(function(item) {
        return {
          fonte: f.nome,
          titulo: item.title || '',
          link: item.link || '',
          data: item.isoDate || item.pubDate || null,
          resumo: (item.contentSnippet || '').slice(0, 200),
        }
      })
    } catch (e) {
      return []
    }
  }))

  const todas = [].concat.apply([], resultados)
  todas.sort(function(a, b) {
    return new Date(b.data || 0) - new Date(a.data || 0)
  })

  return Response.json({ noticias: todas })
}
