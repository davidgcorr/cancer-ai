import type { AnatomyView } from './anatomy'
import type { RegionId } from './regions'

// A selected tissue stays visible even if a different display layer is requested.
export function anatomyVisibility(key:string,system:string,view:AnatomyView,selected:RegionId) {
  const skin=system==='skin',skeleton=system==='skeleton'
  const selectedTissue=(selected==='skin'&&skin)||(selected==='bones'&&skeleton)
  const visible=selectedTissue||(view==='surface'?skin:view==='skeleton'?skeleton:skin||skeleton||system==='organs')
  const ghost=!selectedTissue&&((view==='organs'&&(skin||skeleton))||(selected==='bones'&&skin))
  const opacity=ghost ? (skin ? .045 : ['skull','mandible','ribs_l','ribs_r','sternum','pelvis'].includes(key) ? .12 : .4) : 1
  return {visible,ghost,opacity,selectedTissue}
}
