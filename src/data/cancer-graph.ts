import type { Frequency } from './cancer-evidence'
import type { Region, RegionId } from './regions'
import type { CancerFamily } from './cancer-taxonomy'
export type FlowNode = { id: string; label: string; column: number; kind: 'region' | 'type' | 'subtype' | 'classification'; note: string; sources: string[]; familyId?: string; subtypeId?: string; regionId: RegionId; frequency?: Frequency }
export type FlowLink = { source: string; target: string; value: number }
export type CancerGraph = { nodes: FlowNode[]; links: FlowLink[] }
export function buildCancerGraph(region: Region, families: CancerFamily[], familyId?: string, subtypeId?: string): CancerGraph {
  const nodes = new Map<string, FlowNode>()
  const links: FlowLink[] = []
  const root = `region:${region.id}`
  nodes.set(root, {id:root,label:region.name,column:0,kind:'region',regionId:region.id,note:region.description,sources:[`https://www.cancer.gov/types/${region.source}`]})
  for (const family of families.filter(f=>!familyId || f.id===familyId)) {
    const subtypes = family.subtypes.filter(s=>!subtypeId || s.id===subtypeId)
    if(!subtypes.length)continue
    const fid=`type:${family.id}`
    nodes.set(fid,{id:fid,label:family.label,column:1,kind:'type',frequency:family.frequency,regionId:region.id,familyId:family.id,note:'Selected histologic or disease subtypes in this cancer group. This map is not exhaustive.',sources:[...new Set(subtypes.map(s=>s.source))]})
    let count=0
    for (const subtype of subtypes) {
      const sid=`subtype:${family.id}:${subtype.id}`
      const classification=subtype.classification
      nodes.set(sid,{id:sid,label:subtype.label,column:2,kind:'subtype',frequency:subtype.frequency,regionId:region.id,familyId:family.id,subtypeId:subtype.id,note:`${classification.system}. ${classification.note}`,sources:[subtype.source]})
      links.push({source:fid,target:sid,value:classification.labels.length})
      count+=classification.labels.length
      for(const label of classification.labels) {
        // Share terminals only within the same classification framework.
        const cid=`classification:${region.id}:${classification.system}:${label}`
        const existing=nodes.get(cid)
        nodes.set(cid,{id:cid,label,column:3,kind:'classification',regionId:region.id,note:`${classification.system}. ${classification.note}`,sources:[...new Set([...(existing?.sources??[]),subtype.source])]})
        links.push({source:sid,target:cid,value:1})
      }
    }
    links.push({source:root,target:fid,value:count})
  }
  return {nodes:[...nodes.values()],links}
}
export function connectedNodes(graph: CancerGraph, id: string): Set<string> {
  const result=new Set([id])
  for(const direction of ['up','down'] as const) {
    const queue=[id],visited=new Set<string>()
    while(queue.length) {
      const current=queue.shift()!
      if(visited.has(current))continue
      visited.add(current)
      for(const link of graph.links) {
        if((direction==='up'?link.target:link.source)===current) {
          const next=direction==='up'?link.source:link.target
          result.add(next);queue.push(next)
        }
      }
    }
  }
  return result
}

export function mergeCancerGraphs(graphs: CancerGraph[]): CancerGraph {
  const nodes = new Map<string, FlowNode>()
  for (const graph of graphs) for (const node of graph.nodes) {
    const existing = nodes.get(node.id)
    nodes.set(node.id, { ...node, sources: [...new Set([...(existing?.sources ?? []), ...node.sources])] })
  }
  return { nodes: [...nodes.values()], links: graphs.flatMap(graph => graph.links) }
}
