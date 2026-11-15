import type { CancerFamily, CancerSubtype } from './cancer-taxonomy'
import type { Region } from './regions'
import type { FlowNode } from './cancer-graph'
export type DetailPath = { familyId?:string; subtypeId?:string; stage?:string }
export function resolveDetail(region:Region,families:CancerFamily[],path:DetailPath) {
 const family=families.find(f=>f.id===path.familyId)
 const subtype=family?.subtypes.find(s=>s.id===path.subtypeId)
 const stage=subtype?.classification.labels.includes(path.stage??'')?path.stage:undefined
 const validPath:DetailPath={...(family?{familyId:family.id}:{}),...(subtype?{subtypeId:subtype.id}:{}),...(stage?{stage}:{})}
 const breadcrumbs=[{label:region.name,path:{} as DetailPath},...(family?[{label:family.label,path:{familyId:family.id}}]:[]),...(subtype?[{label:subtype.label,path:{familyId:family!.id,subtypeId:subtype.id}}]:[]),...(stage?[{label:stage,path:validPath}]:[])]
 return {family,subtype,stage,path:validPath,breadcrumbs,title:stage??subtype?.label??family?.label??region.name}
}
export function pathsForFlowNode(families:CancerFamily[],node:FlowNode):DetailPath[] {
 if(node.kind==='region')return [{}]
 if(node.kind==='type')return [{familyId:node.familyId}]
 if(node.kind==='subtype')return [{familyId:node.familyId,subtypeId:node.subtypeId}]
 return families.flatMap(f=>f.subtypes.filter(s=>s.classification.labels.includes(node.label)&&node.id===`classification:${node.regionId}:${s.classification.system}:${node.label}`).map(s=>({familyId:f.id,subtypeId:s.id,stage:node.label})))
}
export function scopedFamilies(families:CancerFamily[],path:DetailPath):CancerFamily[] {
 return families.filter(f=>!path.familyId||f.id===path.familyId).map(f=>({...f,subtypes:f.subtypes.filter(s=>!path.subtypeId||s.id===path.subtypeId)}))
}
export function parentForSubtype(families:CancerFamily[],id:string):{family:CancerFamily;subtype:CancerSubtype}|undefined {
 for(const family of families){const subtype=family.subtypes.find(s=>s.id===id);if(subtype)return{family,subtype}}
}
