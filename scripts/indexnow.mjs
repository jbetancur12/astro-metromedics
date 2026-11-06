import { existsSync, readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Avisa a IndexNow (Bing, Yandex, Seznam...) de las URLs del sitio.
 *
 * Uso:
 *   npm run indexnow                # todas las URLs del sitemap construido
 *   npm run indexnow -- --dry-run   # muestra qué enviaría, sin POST
 *   npm run indexnow -- https://metromedicslab.com/pagina  # solo esas URLs
 *
 * La clave se toma del archivo public/<clave>.txt (o de INDEXNOW_KEY).
 */

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(root, 'public')
const distDir = path.join(root, 'dist')
const host = (process.env.INDEXNOW_HOST || 'metromedicslab.com')
  .replace(/^https?:\/\//i, '')
  .replace(/\/+$/, '')
const endpoint =
  process.env.INDEXNOW_ENDPOINT || 'https://api.indexnow.org/indexnow'

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const urlsFromArgs = args.filter((arg) => !arg.startsWith('--'))

const keyFileName = process.env.INDEXNOW_KEY
  ? `${process.env.INDEXNOW_KEY}.txt`
  : readdirSync(publicDir).find((name) => /^[a-f0-9]{8,128}\.txt$/i.test(name))

if (!keyFileName) {
  console.error(
    `IndexNow: no hay clave. Crea public/<clave>.txt con la clave dentro (mínimo 8 caracteres hexadecimales).`
  )
  process.exit(1)
}

const key = path.basename(keyFileName, '.txt')
const keyValue = readFileSync(path.join(publicDir, keyFileName), 'utf8').trim()

if (keyValue !== key) {
  console.error(
    `IndexNow: ${keyFileName} debe contener únicamente la clave "${key}".`
  )
  process.exit(1)
}

const extractLocs = (xml) =>
  [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((match) => match[1])

const localSitemapUrls = () => {
  if (!existsSync(distDir)) return null
  const files = readdirSync(distDir).filter((name) =>
    /^sitemap-\d+\.xml$/i.test(name)
  )
  if (!files.length) return null
  return files.flatMap((name) =>
    extractLocs(readFileSync(path.join(distDir, name), 'utf8'))
  )
}

const fetchText = async (url) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`${url} respondió ${response.status}`)
  }
  return response.text()
}

const remoteSitemapUrls = async () => {
  const indexUrl = `https://${host}/sitemap-index.xml`
  const index = await fetchText(indexUrl)
  const sitemaps = extractLocs(index)
  if (!sitemaps.length) return extractLocs(index)
  const documents = await Promise.all(sitemaps.map(fetchText))
  return documents.flatMap(extractLocs)
}

const normalize = (url) =>
  /^https?:\/\//i.test(url) ? url : `https://${host}/${url.replace(/^\/+/, '')}`

const collectUrls = async () => {
  if (urlsFromArgs.length) return urlsFromArgs.map(normalize)
  const local = localSitemapUrls()
  if (local?.length) return local
  console.log('IndexNow: no hay dist/ con sitemap; leyendo el sitemap publicado...')
  return remoteSitemapUrls()
}

const urls = [...new Set(await collectUrls())].filter((url) =>
  url.startsWith(`https://${host}/`)
)

if (!urls.length) {
  console.error('IndexNow: no se encontraron URLs para enviar.')
  process.exit(1)
}

const batches = []
for (let i = 0; i < urls.length; i += 10000) {
  batches.push(urls.slice(i, i + 10000))
}

console.log(
  `IndexNow: ${urls.length} URL(s) para ${host} (clave ${key})${
    dryRun ? ' — simulación' : ''
  }`
)

for (const [index, urlList] of batches.entries()) {
  const payload = {
    host,
    key,
    keyLocation: `https://${host}/${key}.txt`,
    urlList
  }

  if (dryRun) {
    console.log(JSON.stringify(payload, null, 2))
    continue
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload)
    })

    if (response.status === 200 || response.status === 202) {
      console.log(
        `IndexNow: lote ${index + 1}/${batches.length} enviado (${urlList.length} URL(s), HTTP ${response.status}).`
      )
    } else {
      console.error(
        `IndexNow: lote ${index + 1}/${batches.length} falló (HTTP ${response.status}):`,
        (await response.text()).slice(0, 500)
      )
      process.exitCode = 1
    }
  } catch (error) {
    console.error('IndexNow: error de conexión:', error.message)
    process.exitCode = 1
  }
}
