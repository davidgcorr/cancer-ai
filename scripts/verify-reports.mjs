import assert from 'node:assert/strict'
import { mkdirSync, writeFileSync } from 'node:fs'
import { createCanvas, Image as CanvasImage } from '@napi-rs/canvas'
import { getRegions } from '../src/data/regions.ts'
import { getTaxonomy } from '../src/data/cancer-taxonomy.ts'
import { resolveDetail, pathsForFlowNode, scopedFamilies } from '../src/data/cancer-detail.ts'
import { buildCancerGraph } from '../src/data/cancer-graph.ts'
import { createReport, reportHtml, frequencyText } from '../src/lib/report/model.ts'
import { downloadPng, downloadHtml } from '../src/lib/report/download.ts'

import { hasPublishedFrequency, formatFrequency } from '../src/lib/frequency.ts'

let entries=0,estimates=0
for(const gender of ['male','female'])for(const region of getRegions(gender)) {
 const families=getTaxonomy(region.id,gender)
 for(const family of families)for(const subtype of family.subtypes) {
  entries++
  assert.ok(subtype.treatment.modalities.length>0)
  assert.ok(subtype.treatment.context.includes('not a treatment plan'))
  assert.match(subtype.treatment.source,/^https:\/\/www\.cancer\.gov\//)
  if(hasPublishedFrequency(subtype.frequency)) {
   estimates++
   assert.ok(frequencyText(subtype.frequency,'en').includes('%'))
   assert.ok(!subtype.frequency.denominator.startsWith('No matched'))
   assert.ok(subtype.frequency.period&&subtype.frequency.population&&subtype.frequency.source)
  } else assert.equal(frequencyText(subtype.frequency,'en'),'')
  const path={familyId:family.id,subtypeId:subtype.id,stage:subtype.classification.labels[0]}
  const detail=resolveDetail(region,families,path)
  assert.equal(detail.breadcrumbs.length,4)
  assert.equal(detail.breadcrumbs[0].label,region.name)
  assert.equal(detail.breadcrumbs[1].label,family.label)
  assert.equal(detail.breadcrumbs[2].label,subtype.label)
  assert.equal(detail.breadcrumbs[3].label,path.stage)
  assert.equal(scopedFamilies(families,path).flatMap(f=>f.subtypes).length,1)
 }
 const graph=buildCancerGraph(region,families)
 for(const node of graph.nodes) {
  const paths=pathsForFlowNode(families,node)
  assert.ok(paths.length>0,`No parent for ${node.id}`)
  for(const path of paths){const detail=resolveDetail(region,families,path);assert.equal(detail.title,node.label)}
 }
 for(const language of ['en','es','fr','de']) {
  const report=createReport({region,families,gender,language,color:'#2563eb',scope:'region',now:new Date('2026-11-15T12:00:00Z')})
  assert.equal(report.entries.length,families.flatMap(f=>f.subtypes).length)
  const html=reportHtml(report)
  assert.ok(html.includes(`<html lang="${language}">`))
  assert.ok(html.includes('<svg'))
  assert.ok(!html.includes('<script'))
  assert.ok(!html.includes('undefined'))
  assert.ok(report.entries.every(entry=>entry.sources.length>=1))
  assert.ok(html.includes('class="treatment-card"'))
  for(const entry of report.entries)if(!entry.frequency)assert.deepEqual(entry.frequencyDetails,[])
  assert.ok(!html.includes('Not curated')&&!html.includes('No matched denominator'))
 }
}
const range=getTaxonomy('liver','female').flatMap(f=>f.subtypes).find(s=>s.id==='fibrolamellar').frequency
assert.equal(formatFrequency(range,'en'),'1%–5%')
assert.equal(formatFrequency({...range,min:6},'en'),'')
assert.equal(formatFrequency({...range,source:''},'en'),'')
assert.equal(formatFrequency({...range,value:0,qualifier:'reported'},'en'),'0%')
assert.equal(formatFrequency({...range,value:NaN,min:undefined,max:undefined},'en'),'')
const noDataRegion=getRegions('male').find(r=>r.id==='brain')
const noDataReport=createReport({region:noDataRegion,families:getTaxonomy('brain','male'),gender:'male',language:'en',color:'#2563eb',scope:'region'})
assert.equal(noDataReport.frequencyNotice,undefined)
assert.ok(!reportHtml(noDataReport).includes('Share among site cases'))

const region=getRegions('female').find(r=>r.id==='lungs'),families=getTaxonomy('lungs','female')
const path={familyId:'nsclc',subtypeId:'lung-adeno',stage:'Stage I'}
const report=createReport({region,families,gender:'female',path,language:'es',color:'#2563eb',scope:'branch',now:new Date('2026-11-15T12:00:00Z')})
assert.equal(report.entries.length,1)
assert.deepEqual(report.entries[0].stages,['Estadio I'])
assert.ok(report.stageNotice)
assert.equal(report.entries[0].frequency,'45 %')
const unsafe={...report,title:'<img src=x onerror=alert(1)>',description:'A & B'}
assert.ok(reportHtml(unsafe).includes('&lt;img'))
assert.ok(!reportHtml(unsafe).includes('<img src=x'))
assert.ok(reportHtml(unsafe).includes('A &amp; B'))
const invalid=resolveDetail(region,families,{familyId:'missing',subtypeId:'wrong',stage:'Stage Z'})
assert.deepEqual(invalid.path,{})

// Run the real browser export functions with a native canvas adapter. This
// exercises SVG decoding, PNG layout/encoding, Blob URLs and download content.
const output='/tmp/onco-milver-report-qa';mkdirSync(output,{recursive:true})
const downloads=[],jobs=[]
class TestImage extends CanvasImage {
 set src(value){
  if(typeof value==='string'&&value.startsWith('blob:'))fetch(value).then(r=>r.arrayBuffer()).then(data=>{super.src=Buffer.from(data)}).catch(error=>this.onerror?.(error))
  else super.src=value
 }
 get src(){return super.src}
}
globalThis.Image=TestImage
globalThis.window={setTimeout:(fn,ms)=>{const timer=setTimeout(fn,ms);timer.unref();return timer}}
globalThis.document={fonts:{ready:Promise.resolve()},body:{appendChild:()=>{}},createElement:tag=>{
 if(tag==='canvas'){
  const canvas=createCanvas(1,1)
  canvas.toBlob=callback=>canvas.encode('png').then(data=>callback(new Blob([data],{type:'image/png'})))
  return canvas
 }
 if(tag==='a'){
  const anchor={href:'',download:'',remove:()=>{},click:()=>jobs.push(fetch(anchor.href).then(r=>r.arrayBuffer()).then(data=>{downloads.push({name:anchor.download,data:Buffer.from(data)});writeFileSync(`${output}/${anchor.download}`,Buffer.from(data))}))}
  return anchor
 }
 throw new Error(`Unexpected DOM element: ${tag}`)
}}
downloadHtml(report)
await downloadPng(report)
const pelvis=getRegions('female').find(r=>r.id==='pelvis')
const fullReport=createReport({region:pelvis,families:getTaxonomy('pelvis','female'),gender:'female',language:'de',color:'#7c3aed',scope:'region',now:new Date('2026-11-15T12:00:00Z')})
assert.equal(fullReport.entries.length,18)
await downloadPng(fullReport)
await Promise.all(jobs)
const png=downloads.find(item=>item.name.endsWith('.png'))
assert.ok(png)
assert.deepEqual([...png.data.subarray(0,8)],[137,80,78,71,13,10,26,10])
assert.equal(png.data.readUInt32BE(16),1400)
assert.ok(png.data.readUInt32BE(20)>1000)
const fullPng=downloads.find(item=>item.name.includes('pelvis-de')&&item.name.endsWith('.png'))
assert.ok(fullPng)
assert.ok(fullPng.data.readUInt32BE(20)>5000)
const html=downloads.find(item=>item.name.endsWith('.html'))
assert.ok(html.data.toString().includes('Adenocarcinoma'))
console.log(`${entries} subtype entries, ${estimates} sourced estimates, parent breadcrumbs and 136 localized region reports verified. Real HTML and PNG exports generated in ${output}.`)
