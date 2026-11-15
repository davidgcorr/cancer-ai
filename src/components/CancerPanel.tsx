import { useI18n } from '@/lib/i18n/provider'
import { useEffect, useMemo, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { Rnd } from 'react-rnd'
import { ArrowUpRight, GripVertical, Maximize2, PanelRightClose, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react'
import { CancerDetails, FrequencyInfo } from '@/components/CancerDetails'
import { ReportExport } from '@/components/ReportExport'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { pathsForFlowNode } from '@/data/cancer-detail'
import type { DetailPath } from '@/data/cancer-detail'
import { CancerSankey } from '@/components/CancerSankey'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { getTaxonomy } from '@/data/cancer-taxonomy'
import { buildCancerGraph, mergeCancerGraphs } from '@/data/cancer-graph'
import type { FlowNode } from '@/data/cancer-graph'
import type { Gender, Region, RegionId } from '@/data/regions'

export function CancerPanel({region,regions,gender,color,onRegionChange,navigation,onPathChange}:{navigation?:{regionId:RegionId;gender:Gender;path:DetailPath};onPathChange:(path:DetailPath)=>void;region:Region;regions:Region[];gender:Gender;color:string;onRegionChange:(id:RegionId)=>void}) {
  const { t } = useI18n()
  const [mode,setMode]=useState<'map'|'details'>('map')
  const [detailSelection,setDetailSelection]=useState<{region:string;gender:Gender;path:DetailPath;choices?:DetailPath[]}>({region:region.id,gender,path:{}})
  const detail=detailSelection.region===region.id&&detailSelection.gender===gender?detailSelection:{path:{} as DetailPath,choices:undefined}
  const [overview,setOverview]=useState(false)
  const [floating,setFloating]=useState(false)
  const [position,setPosition]=useState({x:0,y:80})
  const [size,setSize]=useState({width:900,height:740})
  const [zoom,setZoom]=useState(100)
  const [filter,setFilter]=useState<{region:string;gender:Gender;family?:string;subtype?:string}>({region:region.id,gender})
  const [inspection,setInspection]=useState<{region:string;gender:Gender;node:FlowNode}>()
  const [lastNavigation,setLastNavigation]=useState(navigation)
  if(navigation!==lastNavigation){
    setLastNavigation(navigation)
    if(navigation&&navigation.gender===gender){
    setDetailSelection({region:navigation.regionId,gender,path:navigation.path})
    setFilter({region:navigation.regionId,gender,family:navigation.path.familyId,subtype:navigation.path.subtypeId})
    setInspection(undefined);setOverview(false);setMode(navigation.path.familyId?'details':'map')
    }
  }
  const currentFilter=filter.region===region.id&&filter.gender===gender?filter:undefined
  const inspected=inspection?.region===region.id&&inspection.gender===gender?inspection.node:undefined
  const taxonomy=useMemo(()=>getTaxonomy(region.id,gender),[region.id,gender])
  const graph=useMemo(()=>overview?mergeCancerGraphs(regions.map(r=>buildCancerGraph(r,getTaxonomy(r.id,gender)))):buildCancerGraph(region,taxonomy,currentFilter?.family,currentFilter?.subtype),[overview,regions,gender,region,taxonomy,currentFilter?.family,currentFilter?.subtype])
  const selected=inspected&&graph.nodes.find(n=>n.id===inspected.id)
  const floatPanel=()=>{
    const width=Math.min(1000,window.innerWidth-32),height=Math.min(780,window.innerHeight-32)
    setSize({width,height});setPosition({x:window.innerWidth-width-16,y:Math.max(16,(window.innerHeight-height)/2)});setFloating(true)
  }
  useEffect(()=>{
    if(!floating)return
    const clamp=()=>{
      const width=Math.min(size.width,window.innerWidth),height=Math.min(size.height,window.innerHeight)
      setSize({width,height})
      setPosition(p=>({x:Math.max(0,Math.min(p.x,window.innerWidth-width)),y:Math.max(0,Math.min(p.y,window.innerHeight-height))}))
    }
    window.addEventListener('resize',clamp)
    return ()=>window.removeEventListener('resize',clamp)
  },[floating,size.width,size.height])
  const moveWithKeys=(e:KeyboardEvent<HTMLButtonElement>)=>{
    const delta:Record<string,[number,number]>={ArrowLeft:[-20,0],ArrowRight:[20,0],ArrowUp:[0,-20],ArrowDown:[0,20]}
    if(!floating||!delta[e.key])return
    e.preventDefault();const [x,y]=delta[e.key]
    setPosition(p=>({x:Math.max(0,Math.min(window.innerWidth-size.width,p.x+x)),y:Math.max(0,Math.min(window.innerHeight-size.height,p.y+y))}))
  }
  const clear=()=>{setFilter({region:region.id,gender});setInspection(undefined)}
  const inspect=(node:FlowNode)=>{
    onRegionChange(node.regionId)
    if(overview)setOverview(false)
    const targetRegion=overview?node.regionId:region.id
    setInspection({region:targetRegion,gender,node})
    const candidates=pathsForFlowNode(getTaxonomy(targetRegion,gender),node)
    setDetailSelection({region:targetRegion,gender,path:candidates.length===1?candidates[0]:{},choices:candidates.length>1?candidates:undefined})
    setMode('details')
    if(targetRegion===region.id&&candidates.length===1)onPathChange(candidates[0])
    if(node.kind==='region'){setFilter({region:targetRegion,gender});setInspection(undefined)}
    if(node.kind==='type')setFilter({region:targetRegion,gender,family:node.familyId})
    if(node.kind==='subtype')setFilter({region:targetRegion,gender,family:node.familyId,subtype:node.subtypeId})
  }
  const navigateDetail=(path:DetailPath)=>{
    onRegionChange(region.id)
    onPathChange(path)
    setDetailSelection({region:region.id,gender,path})
    setFilter({region:region.id,gender,family:path.familyId,subtype:path.subtypeId})
    setOverview(false)
  }
  const exportPath:DetailPath=mode==='details'?detail.path:{familyId:currentFilter?.family,subtypeId:currentFilter?.subtype}
  const focusedFamily=taxonomy.find(f=>f.id===selected?.familyId)
  const focusedSubtype=focusedFamily?.subtypes.find(s=>s.id===selected?.subtypeId)
  const panel=<Card className={`flex h-full min-h-0 flex-col gap-0 overflow-hidden py-0 ${floating?'shadow-xl':'shadow-none'}`} aria-label={t("Cancer classification panel")}>
    <CardHeader className={`sankey-drag-handle flex flex-row items-start justify-end gap-3 px-3 pt-2 pb-0 ${floating?'cursor-move':''}`}>
      <div className="flex items-center gap-1">
        {floating&&<Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon-sm" aria-label={t("Move panel with arrow keys, or drag the header")} onKeyDown={moveWithKeys}><GripVertical/></Button></TooltipTrigger><TooltipContent>{t("Drag header or use arrow keys to move")}</TooltipContent></Tooltip>}
        <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon-sm" aria-label={t(floating?'Dock panel on right':'Float panel to move and resize')} onClick={()=>floating?setFloating(false):floatPanel()}>{floating?<PanelRightClose/>:<Maximize2/>}</Button></TooltipTrigger><TooltipContent>{t(floating?'Dock panel':'Float, move and resize')}</TooltipContent></Tooltip>
      </div>
    </CardHeader>
    <CardContent className="min-h-0 flex-1 space-y-4 overflow-auto p-4">
      <Accordion type="single" collapsible defaultValue="">
        <AccordionItem value="regions" className="rounded-md border px-3">
          <AccordionTrigger className="items-center py-3"><span className="flex flex-wrap items-center gap-2">{t('Body regions')}<Badge variant="secondary">{regions.length}</Badge><span className="font-normal text-muted-foreground">{t(region.name)}</span></span></AccordionTrigger>
          <AccordionContent>
            <Accordion key={`${gender}:${region.id}`} type="single" collapsible onValueChange={id=>{if(id){clear();setOverview(false);onRegionChange(id as RegionId)}}}>
              {regions.map(item=><AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger className={`py-3 ${item.id===region.id?'text-primary':''}`}>{t(item.name)}</AccordionTrigger>
                <AccordionContent className="space-y-1 pl-3">
                  <Accordion type="single" collapsible>
                    {getTaxonomy(item.id,gender).map(family=><AccordionItem key={family.id} value={family.id}>
                      <AccordionTrigger className="py-2 text-xs" onClick={()=>{navigateDetail({familyId:family.id});setMode('details')}}>{t(family.label)}</AccordionTrigger>
                      <AccordionContent className="space-y-1 border-l pl-3">
                        {family.subtypes.map(subtype=><Button key={subtype.id} variant="ghost" size="sm" className="h-auto w-full justify-start whitespace-normal py-2 text-left" onClick={()=>{navigateDetail({familyId:family.id,subtypeId:subtype.id});setMode('details')}}>{t(subtype.label)}</Button>)}
                      </AccordionContent>
                    </AccordionItem>)}
                  </Accordion>
                </AccordionContent>
              </AccordionItem>)}
            </Accordion>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button variant="outline" size="sm" aria-pressed={overview} onClick={()=>{clear();setOverview(value=>!value)}}>{t(overview?region.name:'All body regions')}</Button>
        <div className="flex items-center gap-1"><Button variant="outline" size="icon-sm" aria-label={t("Zoom out diagram")} disabled={zoom<=60} onClick={()=>setZoom(z=>Math.max(60,z-20))}><ZoomOut/></Button><Button variant="ghost" size="sm" onClick={()=>setZoom(100)} aria-label={t("Reset diagram zoom")}>{zoom}%</Button><Button variant="outline" size="icon-sm" aria-label={t("Zoom in diagram")} disabled={zoom>=160} onClick={()=>setZoom(z=>Math.min(160,z+20))}><ZoomIn/></Button></div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2"><ToggleGroup type="single" variant="outline" value={mode} onValueChange={value=>{if(value==='map'||value==='details')setMode(value)}} aria-label={t('Information view')}><ToggleGroupItem value="map">{t('Map')}</ToggleGroupItem><ToggleGroupItem value="details">{t('Details')}</ToggleGroupItem></ToggleGroup><ReportExport region={region} families={taxonomy} gender={gender} path={exportPath} color={color}/></div>
      {mode==='details'?<CancerDetails region={region} families={taxonomy} path={detail.path} choices={detail.choices} onNavigate={navigateDetail}/>:<>
      <div className="flex flex-wrap items-center gap-2"><Button variant="outline" size="sm" disabled={!currentFilter?.family&&!inspected} onClick={clear}><RotateCcw/>{t("All cancer types")}</Button>{!overview&&currentFilter?.family&&<Badge variant="secondary">{t(taxonomy.find(f=>f.id===currentFilter.family)?.label??'')}</Badge>}{!overview&&currentFilter?.subtype&&<Button variant="ghost" size="sm" onClick={()=>{setFilter({region:region.id,gender,family:currentFilter.family});setInspection(undefined)}}>{t("Show all subtypes")}</Button>}</div>
      <CancerSankey graph={graph} color={color} zoom={zoom} selected={selected?.id} onSelect={inspect}/>
      <p className="text-xs text-muted-foreground">{t("Widths count classification links, not patient frequency.")}</p>
      <Separator/>
      {selected&&(focusedSubtype?.frequency||focusedFamily?.frequency)&&<FrequencyInfo frequency={focusedSubtype?.frequency??focusedFamily?.frequency}/>}
      <div aria-live="polite" className="space-y-3">
        <div className="flex items-center gap-2"><h3 className="text-sm font-medium">{t(selected?.label??(overview?'All body regions':region.name))}</h3>{selected&&<Badge variant="outline">{t(selected.kind)}</Badge>}</div>
        <p className="text-sm leading-relaxed text-muted-foreground">{t(selected?.note??(overview?'Select a region or cancer type to focus its classification map and synchronize the body model.':region.description))}</p>
        <div className="flex flex-wrap gap-2">{(selected?.sources??[`https://www.cancer.gov/types/${region.source}`]).slice(0,4).map((source,i)=><Button key={source} variant="outline" size="sm" asChild><a href={source} target="_blank" rel="noreferrer">{t("NCI reference")}{(selected?.sources.length??0)>1?` ${i+1}`:''}<ArrowUpRight/></a></Button>)}</div>
      </div>
      </>}
    </CardContent>
  </Card>
  if(!floating)return <aside className="h-[790px] min-w-0 ">{panel}</aside>
  return <><aside className="flex h-32 items-center justify-center rounded-lg border border-dashed "><Button variant="outline" onClick={()=>setFloating(false)}><PanelRightClose/>{t("Dock cancer map here")}</Button></aside>{createPortal(<div className="pointer-events-none fixed inset-0 z-40"><Rnd bounds="parent" position={position} size={size} minWidth={Math.min(360,window.innerWidth-32)} minHeight={350} maxWidth={window.innerWidth} maxHeight={window.innerHeight} dragHandleClassName="sankey-drag-handle" cancel="button,a,[role=button]" style={{pointerEvents:'auto'}} onDragStop={(_,d)=>setPosition({x:d.x,y:d.y})} onResizeStop={(_,__,ref,___,pos)=>{setSize({width:ref.offsetWidth,height:ref.offsetHeight});setPosition(pos)}}>{panel}</Rnd></div>,document.body)}</>
}
