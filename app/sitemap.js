import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const praias = [
  'silveira-sul', 'silveira-norte', 'ferrugem-norte', 'ferrugem-sul', 'barra',
  'siriu-norte', 'siriu-meio', 'gamboa', 'ouvidor', 'central'
]

export default async function sitemap() {
  const base = 'https://garopabasurf.app'

  const paginas = [
    { url: base, changeFrequency: 'daily', priority: 1 },
    { url: base + '/praias', changeFrequency: 'daily', priority: 0.9 },
    { url: base + '/blog', changeFrequency: 'daily', priority: 0.8 },
  ]

  const praiasUrls = praias.map(function(slug) {
    return { url: base + '/praias/' + slug, changeFrequency: 'hourly', priority: 0.8 }
  })

  let postsUrls = []
  try {
    const { data } = await supabase
      .from('posts')
      .select('slug, atualizado_em, criado_em')
      .eq('publicado', true)
    if (data) {
      postsUrls = data.map(function(post) {
        return {
          url: base + '/blog/' + post.slug,
          lastModified: new Date(post.atualizado_em || post.criado_em),
          changeFrequency: 'weekly',
          priority: 0.7,
        }
      })
    }
  } catch (e) {}

  return paginas.concat(praiasUrls).concat(postsUrls).map(function(p) {
    return Object.assign({ lastModified: new Date() }, p)
  })
}
