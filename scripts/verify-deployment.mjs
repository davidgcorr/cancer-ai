import assert from 'node:assert/strict'

const origin = new URL(process.argv[2] ?? 'https://oncomilver.davidgc.com')
async function check() {
  const response = await fetch(origin, { signal: AbortSignal.timeout(15000) })
  assert.equal(response.status, 200, 'Homepage must return HTTP 200')
  assert.match(response.headers.get('content-type') ?? '', /text\/html/)
  const html = await response.text()
  assert.match(html, /onco-milver/)
  const script = html.match(/src="([^"]+\.js)"/)?.[1]
  assert.ok(script, 'Built application script must be present')
  const app = await fetch(new URL(script, origin), { signal: AbortSignal.timeout(15000) })
  assert.equal(app.status, 200)
  assert.match(app.headers.get('content-type') ?? '', /javascript/)
  const code = await app.text()
  const models = [...new Set(code.match(/\/assets\/anatomy-(?:male|female)-[\w-]+\.glb/g))]
  assert.equal(models.length, 2, 'Both body models must be included')
  for (const path of [...models, '/anatomy/z-organs-female.glb', '/anatomy/z-organs-male.glb']) {
    const model = await fetch(new URL(path, origin), { headers: { Range: 'bytes=0-11' }, signal: AbortSignal.timeout(15000) })
    assert.ok(model.status === 200 || model.status === 206, `Model unavailable: ${path}`)
    const bytes = new Uint8Array(await model.arrayBuffer())
    assert.equal(new TextDecoder().decode(bytes.slice(0, 4)), 'glTF', `Invalid model: ${path}`)
  }
  const audit = await fetch(new URL('/cancer-catalog-audit.md', origin), { signal: AbortSignal.timeout(15000) })
  assert.equal(audit.status, 200, 'Source audit must be available')
}
for (let attempt = 1; ; attempt++) {
  try {
    await check()
    console.log(`Verified ${origin}: HTML, application JavaScript, both anatomy models, supplements, and source audit.`)
    break
  } catch (error) {
    if (attempt === 6) throw error
    console.log(`Deployment check ${attempt}/6: ${error.message}; retrying in 5 seconds.`)
    await new Promise(resolve => setTimeout(resolve, 5000))
  }
}
