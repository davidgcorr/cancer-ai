import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { messages } from '../src/lib/i18n/messages.ts'
import { hasTranslation, isLanguage, savedLanguage, translate } from '../src/lib/i18n/core.ts'
import { getRegions } from '../src/data/regions.ts'
import { getTaxonomy } from '../src/data/cancer-taxonomy.ts'
import { buildCancerGraph } from '../src/data/cancer-graph.ts'
import { ANATOMY_STRUCTURES } from 'open-anatomy-3d'

const required = new Set()
for (const gender of ['male','female']) for (const region of getRegions(gender)) {
  for(const value of [region.name,region.system,region.description,...region.types])required.add(value)
  const families=getTaxonomy(region.id,gender)
  for(const family of families) for(const subtype of family.subtypes) {
    for(const text of [family.label,subtype.label,subtype.classification.system,subtype.classification.note,...subtype.classification.labels,...(subtype.treatment?.modalities??[]),subtype.treatment?.context,...Object.entries(subtype.frequency??{}).filter(([key,value])=>typeof value==='string'&&!['source','qualifier'].includes(key)).map(([,value])=>value)])required.add(text)
  }
  for(const node of buildCancerGraph(region,families).nodes)for(const text of [node.label,node.note])required.add(text)
}
for(const structure of ANATOMY_STRUCTURES.filter(s=>['skin','skeleton','organs'].includes(s.system)))required.add(structure.label)
for(const file of ['src/App.tsx','src/components/CancerPanel.tsx','src/components/CancerSankey.tsx','src/components/BodyViewer.tsx','src/components/CancerDetails.tsx','src/components/ReportExport.tsx','src/lib/report/model.ts','src/lib/report/download.ts']) {
  const source=readFileSync(new URL(`../${file}`,import.meta.url),'utf8')
  for(const match of source.matchAll(/\bt\(("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g))required.add(match[1][0]==='"'?JSON.parse(match[1]):match[1].slice(1,-1))
}
const anatomy=readFileSync(new URL('../src/data/anatomy.ts',import.meta.url),'utf8')
for(const match of anatomy.matchAll(/return '([^']+)'/g))if(match[1].includes(' '))required.add(match[1])
const missing=[...required].filter(text=>!hasTranslation(text))
assert.deepEqual(missing,[],'All user-facing clinical and interface strings require ES/FR/DE translations')
for(const [key,values] of Object.entries(messages)) {
 assert.equal(values.length,3)
 for(const text of values) {
  assert.ok(text.trim(),`Empty translation for ${key}`)
  assert.deepEqual([...text.matchAll(/\{\w+\}/g)].map(m=>m[0]).sort(),[...key.matchAll(/\{\w+\}/g)].map(m=>m[0]).sort(),`Placeholder mismatch for ${key}`)
 }
}
assert.equal(translate('es','Leukemia'),'Leucemia')
assert.equal(translate('fr','Stage III'),'Stade III')
assert.equal(translate('de','Grade 4'),'Grad 4')
assert.equal(translate('es','Kidney (L)'),'Riñón (Izquierdo)')
assert.equal(translate('fr','Rai IV'),'Rai IV')
assert.equal(translate('en','Stage III'),'Stage III')
assert.equal(isLanguage('pt'),false)
assert.equal(isLanguage('__proto__'),false)
assert.equal(isLanguage('de'),true)
for(const code of ['en','es','fr','de']) {
 globalThis.localStorage={getItem:key=>{assert.equal(key,'onco-milver-language');return code}}
 assert.equal(savedLanguage(),code)
}
globalThis.localStorage={getItem:()=> 'invalid'};assert.equal(savedLanguage(),'en')
globalThis.localStorage={getItem:()=>{throw new Error('Storage blocked')}};assert.equal(savedLanguage(),'en')
delete globalThis.localStorage
console.log(`${Object.keys(messages).length} translation entries; ${required.size} interface, anatomy, and clinical strings verified in ES/FR/DE. Placeholders, saved preferences, invalid locale fallback, and clinical labels passed.`)
