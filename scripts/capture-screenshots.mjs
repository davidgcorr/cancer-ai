import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { chromium, expect } from '@playwright/test'
import { createCanvas, loadImage } from '@napi-rs/canvas'

const origin=process.env.SCREENSHOT_URL??'http://127.0.0.1:4174'
const preview=process.env.SCREENSHOT_URL?undefined:spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4174','--strictPort'],{stdio:'ignore'})
if(preview) {
  try {
    for(let attempt=0;;attempt++) {
      try {if((await fetch(origin)).ok)break}catch { /* Wait for the local server. */ }
      if(attempt===40||preview.exitCode!==null)throw new Error('Local preview failed to start on port 4174. Stop another server or set SCREENSHOT_URL.')
      await new Promise(resolve=>setTimeout(resolve,250))
    }
  } catch(error){preview.kill();throw error}
}
const output=resolve('docs/screenshots/features')
mkdirSync(output,{recursive:true})
const browser=await chromium.launch({channel:process.env.SCREENSHOT_BROWSER??'chrome',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']}).catch(error=>{preview?.kill();throw error})
const context=await browser.newContext({viewport:{width:1600,height:1080},deviceScaleFactor:1,locale:'en-US',colorScheme:'light',reducedMotion:'reduce'})
const page=await context.newPage()
const captures=[]
const temporary=mkdtempSync(join(tmpdir(),'onco-screenshots-'))
async function anatomyReady() {
  await page.waitForLoadState('networkidle')
  await expect(page.getByText('Model unavailable',{exact:true})).toHaveCount(0)
  await expect(page.getByText('Loading anatomical model…',{exact:true})).toHaveCount(0,{timeout:60000})
  // Check the rendered canvas itself, so empty WebGL frames cannot become screenshots.
  await expect.poll(async()=>{
    const image=await loadImage(await page.locator('canvas').screenshot())
    const canvas=createCanvas(image.width,image.height),ctx=canvas.getContext('2d')
    ctx.drawImage(image,0,0)
    const {data}=ctx.getImageData(0,0,image.width,image.height)
    let colored=0
    for(let i=0;i<data.length;i+=4)if(data[i]>data[i+1]+4&&data[i+1]>data[i+2]+2)colored++
    return colored
  },{timeout:60000,intervals:[500,1000]}).toBeGreaterThan(150)
}
async function capture(name,description,target=page) {
  await page.mouse.move(1590,1050)
  await page.evaluate(()=>document.fonts.ready)
  await target.screenshot({path:join(output,name+'.png'),animations:'disabled',fullPage:typeof target.goto==='function'})
  captures.push({file:name+'.png',description})
  console.log(`Saved ${name}.png`)
}
async function region(name) {
  await page.locator('#anatomy-tree').getByRole('button',{name,exact:true}).last().click()
  await anatomyReady()
}
try {
  await page.goto(origin)
  await anatomyReady()
  await capture('01-anatomy-and-cancer-map','Male anatomy, CAD-style region tree, and lung cancer Sankey diagram')
  await region('Skin')
  await capture('02-skin-cancer','Opaque skin surface with skin cancer classifications')
  await region('Bones')
  await capture('03-bone-cancer','Visible skeleton with bone sarcoma classifications')
  await region('Lungs')
  await page.getByRole('radio',{name:'Female',exact:true}).click()
  await anatomyReady()
  await capture('04-female-anatomy','Female anatomical model and synchronized lung cancer map')
  await region('Kidneys')
  await page.locator('#anatomy-tree').getByRole('button',{name:'Renal cell carcinoma',exact:true}).click()
  await page.getByRole('button',{name:/^Clear cell RCC/}).click()
  await expect(page.getByRole('heading',{name:'Clear cell RCC',exact:true})).toBeVisible()
  await capture('05-subtype-frequency','Subtype breadcrumbs and a sourced frequency estimate with its denominator')
  await page.getByRole('link',{name:'Treatment source',exact:true}).scrollIntoViewIfNeeded()
  await capture('06-treatment-cards','Educational treatment cards, source links, and disease classifications',page.locator('aside'))
  await page.getByRole('button',{name:'Export report',exact:true}).click()
  await capture('07-report-export','Report export dialog with branch scope and HTML/PNG download options')
  const downloadPromise=page.waitForEvent('download')
  await page.getByRole('button',{name:'Download HTML',exact:true}).click()
  const download=await downloadPromise
  const htmlPath=join(temporary,'report.html')
  await download.saveAs(htmlPath)
  const reportHtml=readFileSync(htmlPath,'utf8')
  assert.match(reportHtml,/treatment-card/)
  const report=await context.newPage()
  await report.setViewportSize({width:1200,height:1100})
  await report.setContent(reportHtml,{waitUntil:'load'})
  await capture('08-exported-html-report','Actual downloaded standalone HTML report with classification diagram, frequency, treatments, and references',report)
  await report.close()
  await page.getByRole('button',{name:'Close',exact:true}).click()
  await page.goto(origin)
  await anatomyReady()
  await page.getByRole('button',{name:'Minimize 3D model',exact:true}).click()
  await expect(page.getByRole('button',{name:'Restore 3D model',exact:true})).toBeVisible()
  await capture('09-minimized-anatomy','Centered cancer map with the anatomy panel minimized')
  await page.getByRole('button',{name:'Restore 3D model',exact:true}).click()
  await anatomyReady()
  await page.getByRole('button',{name:'Float panel to move and resize',exact:true}).click()
  await capture('10-floating-cancer-map','Movable, resizable cancer map panel')
  await page.getByRole('button',{name:'Dock panel on right',exact:true}).click()
  await page.getByRole('button',{name:'Settings',exact:true}).click()
  await page.getByRole('menuitemradio',{name:'Español',exact:true}).click()
  await page.getByRole('button',{name:'Ajustes',exact:true}).click()
  await page.getByRole('menuitemradio',{name:'Azul',exact:true}).click()
  await page.getByRole('button',{name:'Ajustes',exact:true}).click()
  await capture('11-spanish-and-palette','Spanish translation and selectable palette settings')
  await page.keyboard.press('Escape')
  await page.setViewportSize({width:390,height:844})
  await page.goto(origin)
  await anatomyReady()
  await capture('12-mobile-explorer','Mobile anatomy viewer with collapsed CAD navigation, icon controls, and translated cancer map')
  const manifest={capturedOn:new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Berlin'}).format(new Date()),source:origin,desktopViewport:{width:1600,height:1080},captures}
  writeFileSync(join(output,'manifest.json'),JSON.stringify(manifest,null,2)+'\n')
  writeFileSync(join(output,'README.md'),'# Feature screenshots\n\nCaptured from the running application on '+manifest.capturedOn+' using isolated headless Chrome. Screenshots are real browser captures, not mockups. The exported report is downloaded through the interface.\n\n'+captures.map(c=>`## ${c.description}\n\n![${c.description}](${c.file})\n`).join('\n')+'\nRefresh with `npm run screenshots`; see the root README for setup. Anatomy asset licenses and attribution remain applicable.\n')
  console.log(`Captured ${captures.length} feature screenshots in ${output}`)
} finally {
  await browser.close()
  preview?.kill()
  rmSync(temporary,{recursive:true,force:true})
}
