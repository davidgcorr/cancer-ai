import { useMemo, useState } from 'react'
import { ChevronRight, Layers, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { useI18n } from '@/lib/i18n/provider'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { getTaxonomy } from '@/data/cancer-taxonomy'
import type { DetailPath } from '@/data/cancer-detail'
import type { Gender, Region, RegionId } from '@/data/regions'

export function AnatomyTree({regions,gender,selected,path,onSelect}:{regions:Region[];gender:Gender;selected:RegionId;path:DetailPath;onSelect:(region:RegionId,path:DetailPath)=>void}) {
  const {t}=useI18n()
  const [open,setOpen]=useState(()=>typeof window==='undefined'||window.innerWidth>=640)
  const [expanded,setExpanded]=useState<Set<string>>(()=>new Set([selected]))
  const catalog=useMemo(()=>regions.map(region=>({region,families:getTaxonomy(region.id,gender)})),[regions,gender])
  const [expandedSelection,setExpandedSelection]=useState(selected)
  if(expandedSelection!==selected){setExpandedSelection(selected);setExpanded(current=>new Set([...current,selected]))}
  const toggle=(id:string)=>setExpanded(current=>{const next=new Set(current);if(next.has(id))next.delete(id);else next.add(id);return next})
  const label=t(open?'Hide anatomy tree':'Show anatomy tree')
  return <Card className={`relative z-10 flex max-h-full shrink-0 flex-col gap-0 self-start overflow-hidden py-0 shadow-sm ${open?'w-40 bg-background/95 sm:w-44':'bg-background'}`}>
    <div className="flex items-center justify-between gap-2 p-1">
      {open&&<span id="anatomy-tree-label" className="flex items-center gap-2 px-2 text-xs font-medium"><Layers className="size-3.5" aria-hidden="true"/>{t('Body regions')}</span>}
      <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon-sm" aria-label={label} aria-expanded={open} aria-controls="anatomy-tree" onClick={()=>setOpen(value=>!value)}>{open?<PanelLeftClose/>:<PanelLeftOpen/>}</Button></TooltipTrigger><TooltipContent>{label}</TooltipContent></Tooltip>
    </div>
    <nav id="anatomy-tree" aria-labelledby={open?'anatomy-tree-label':undefined} aria-label={!open?t('Body regions'):undefined} hidden={!open} className="min-h-0 flex-1 overflow-y-auto border-t p-1">
      <ul className="space-y-0.5">
        {catalog.map(({region,families})=>{
          const isOpen=expanded.has(region.id)
          return <li key={region.id}>
            <div className="flex items-center">
              <Button variant="ghost" size="icon-xs" aria-label={t(region.name)} aria-expanded={isOpen} aria-controls={`tree-${region.id}`} onClick={()=>toggle(region.id)}><ChevronRight className={`size-3 transition-transform ${isOpen?'rotate-90':''}`}/></Button>
              <Button variant={selected===region.id&&!path.familyId?'secondary':'ghost'} size="sm" className="h-auto min-w-0 flex-1 justify-start whitespace-normal px-2 py-1.5 text-left text-xs" aria-current={selected===region.id&&!path.familyId?'true':undefined} onClick={()=>onSelect(region.id,{})}>{t(region.name)}</Button>
            </div>
            <ul id={`tree-${region.id}`} hidden={!isOpen} className="ml-3 space-y-0.5 border-l pl-2">
              {families.map(family=><li key={family.id}><Button variant={selected===region.id&&path.familyId===family.id?'secondary':'ghost'} size="sm" className="h-auto w-full justify-start whitespace-normal px-2 py-1.5 text-left text-xs" aria-current={selected===region.id&&path.familyId===family.id?'true':undefined} onClick={()=>onSelect(region.id,{familyId:family.id})}>{t(family.label)}</Button></li>)}
            </ul>
          </li>
        })}
      </ul>
    </nav>
  </Card>
}
