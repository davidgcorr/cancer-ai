import assert from 'node:assert/strict'
import { sankey } from 'd3-sankey'
import { getRegions } from '../src/data/regions.ts'
import { getTaxonomy } from '../src/data/cancer-taxonomy.ts'
import { buildCancerGraph, connectedNodes, mergeCancerGraphs } from '../src/data/cancer-graph.ts'

let diagrams=0
for(const gender of ['male','female']) {
 const regions=getRegions(gender)
 assert.equal(regions.length,17)
 assert.equal(new Set(regions.map(r=>r.id)).size,17)
 for(const region of regions) {
   const families=getTaxonomy(region.id,gender)
   assert.deepEqual(families.map(f=>f.label),region.types, `Region/family mismatch for ${region.id}`)
   for(const family of families) {
     assert.ok(family.subtypes.length)
     for(const subtype of family.subtypes) {
       assert.ok(subtype.classification.labels.length)
       assert.ok(subtype.classification.note.length)
       assert.ok(subtype.source.startsWith('https://www.cancer.gov/types/'))
     }
   }
   const graph=buildCancerGraph(region,families)
   assert.equal(new Set(graph.nodes.map(n=>n.id)).size,graph.nodes.length)
   const nodes=new Map(graph.nodes.map(n=>[n.id,n]))
   for(const link of graph.links) {
     assert.ok(nodes.has(link.source)&&nodes.has(link.target))
     assert.equal(nodes.get(link.target).column,nodes.get(link.source).column+1)
     assert.ok(link.value>0)
   }
   for(const node of graph.nodes.filter(n=>n.column===1||n.column===2)) {
     const incoming=graph.links.filter(l=>l.target===node.id).reduce((v,l)=>v+l.value,0)
     const outgoing=graph.links.filter(l=>l.source===node.id).reduce((v,l)=>v+l.value,0)
     assert.equal(incoming,outgoing,'Sankey flow must conserve classification counts')
   }
   const layout=sankey().nodeId(n=>n.id).nodeAlign(n=>n.column).extent([[0,0],[800,1200]])({nodes:graph.nodes.map(n=>({...n})),links:graph.links.map(l=>({...l}))})
   assert.ok(layout.nodes.every(n=>[n.x0,n.y0,n.x1,n.y1].every(Number.isFinite)))
   for(const family of families) {
     const filtered=buildCancerGraph(region,families,family.id)
     assert.equal(filtered.nodes.filter(n=>n.column===1).length,1)
     for(const subtype of family.subtypes) {
       const specific=buildCancerGraph(region,families,family.id,subtype.id)
       assert.equal(specific.nodes.filter(n=>n.column===2).length,1)
     }
   }
   const root=graph.nodes.find(n=>n.column===0)
   assert.equal(connectedNodes(graph,root.id).size,graph.nodes.length)
   diagrams++
 }
 const allGraph=mergeCancerGraphs(regions.map(r=>buildCancerGraph(r,getTaxonomy(r.id,gender))))
 assert.equal(allGraph.nodes.filter(n=>n.column===0).length,17)
 assert.equal(new Set(allGraph.nodes.map(n=>n.id)).size,allGraph.nodes.length)
 const overview=sankey().nodeId(n=>n.id).nodeAlign(n=>n.column).extent([[0,0],[800,4000]])({nodes:allGraph.nodes.map(n=>({...n})),links:allGraph.links.map(l=>({...l}))})
 assert.ok(overview.nodes.every(n=>[n.x0,n.y0,n.x1,n.y1].every(Number.isFinite)))
 const blood=getTaxonomy('blood',gender).find(f=>f.id==='leukemia')
 for(const acute of blood.subtypes.filter(s=>['all','aml'].includes(s.id))) assert.ok(acute.classification.labels.every(l=>!l.includes('Stage')))
 assert.ok(blood.subtypes.find(s=>s.id==='cll').classification.labels.every(l=>l.startsWith('Rai')))
 const brain=getTaxonomy('brain',gender)
 assert.ok(brain.flatMap(f=>f.subtypes).every(s=>s.classification.labels.every(l=>l.startsWith('Grade'))))
 const smallCell=getTaxonomy('lungs',gender).find(f=>f.id==='sclc')
 assert.deepEqual(smallCell.subtypes[0].classification.labels,['Limited stage','Extensive stage'])
}
console.log(`${diagrams} region/gender Sankeys verified: complete taxonomy coverage, unique nodes, valid links, flow conservation, finite layouts, filters, tracing, and staging exceptions.`)
