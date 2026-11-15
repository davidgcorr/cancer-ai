import { useEffect, useMemo, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { Rnd } from 'react-rnd'
import { ArrowUpRight, GripVertical, Maximize2, PanelRightClose, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react'
import { CancerSankey } from '@/components/CancerSankey'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { getTaxonomy } from '@/data/cancer-taxonomy'
import { buildCancerGraph, mergeCancerGraphs } from '@/data/cancer-graph'
import type { FlowNode } from '@/data/cancer-graph'
import type { Gender, Region, RegionId } from '@/data/regions'

export function CancerPanel({region,regions,gender,color,onRegionChange}:{region:Region;regions:Region[];gender:Gender;color:string;onRegionChange:(id:RegionId)=>void}) {
  const [overview,setOverview]=useState(false)
  const [floating,setFloating]=useState(false)
  const [position,setPosition]=useState({x:0,y:80})
  const [size,setSize]=useState({width:900,height:740})
  const [zoom,setZoom]=useState(100)
  const [filter,setFilter]=useState<{region:string;gender:Gender;family?:string;subtype?:string}>({region:region.id,gender})
  const [inspection,setInspection]=useState<{region:string;gender:Gender;node:FlowNode}>()
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
    if(overview&&node.kind!=='classification') {setOverview(false);onRegionChange(node.regionId)}
    const targetRegion=overview&&node.kind!=='classification'?node.regionId:region.id
    setInspection({region:targetRegion,gender,node})
    if(node.kind==='region'){setFilter({region:targetRegion,gender});setInspection(undefined)}
    if(node.kind==='type')setFilter({region:targetRegion,gender,family:node.familyId})
    if(node.kind==='subtype')setFilter({region:targetRegion,gender,family:node.familyId,subtype:node.subtypeId})
  }
  const panel=<Card className={`flex h-full min-h-0 flex-col gap-0 overflow-hidden py-0 ${floating?'shadow-xl':'shadow-none'}`} aria-label="Cancer classification panel">
    <CardHeader className={`sankey-drag-handle flex flex-row items-start justify-between gap-3 border-b px-4 py-3 ${floating?'cursor-move':''}`}>
      <div className="space-y-1"><CardTitle className="text-base">Cancer map</CardTitle><CardDescription>Region → type → subtype → classification</CardDescription></div>
      <div className="flex items-center gap-1">
        {floating&&<Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon-sm" aria-label="Move panel with arrow keys, or drag the header" onKeyDown={moveWithKeys}><GripVertical/></Button></TooltipTrigger><TooltipContent>Drag header or use arrow keys to move</TooltipContent></Tooltip>}
        <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon-sm" aria-label={floating?'Dock panel on right':'Float panel to move and resize'} onClick={()=>floating?setFloating(false):floatPanel()}>{floating?<PanelRightClose/>:<Maximize2/>}</Button></TooltipTrigger><TooltipContent>{floating?'Dock panel':'Float, move and resize'}</TooltipContent></Tooltip>
      </div>
    </CardHeader>
    <CardContent className="min-h-0 flex-1 space-y-4 overflow-auto p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Select value={overview?'all':region.id} onValueChange={id=>{clear();if(id==='all'){setOverview(true)}else if(regions.some(r=>r.id===id)){setOverview(false);onRegionChange(id as RegionId)}}}><SelectTrigger aria-label="Sankey body region" className="w-[200px]"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="all">All body regions</SelectItem>{regions.map(r=><SelectItem value={r.id} key={r.id}>{r.name}</SelectItem>)}</SelectContent></Select>
        <div className="flex items-center gap-1"><Button variant="outline" size="icon-sm" aria-label="Zoom out diagram" disabled={zoom<=60} onClick={()=>setZoom(z=>Math.max(60,z-20))}><ZoomOut/></Button><Button variant="ghost" size="sm" onClick={()=>setZoom(100)} aria-label="Reset diagram zoom">{zoom}%</Button><Button variant="outline" size="icon-sm" aria-label="Zoom in diagram" disabled={zoom>=160} onClick={()=>setZoom(z=>Math.min(160,z+20))}><ZoomIn/></Button></div>
      </div>
      <div className="flex flex-wrap items-center gap-2"><Button variant="outline" size="sm" disabled={!currentFilter?.family&&!inspected} onClick={clear}><RotateCcw/>All cancer types</Button>{!overview&&currentFilter?.family&&<Badge variant="secondary">{taxonomy.find(f=>f.id===currentFilter.family)?.label}</Badge>}{!overview&&currentFilter?.subtype&&<Button variant="ghost" size="sm" onClick={()=>{setFilter({region:region.id,gender,family:currentFilter.family});setInspection(undefined)}}>Show all subtypes</Button>}</div>
      <CancerSankey graph={graph} color={color} zoom={zoom} selected={selected?.id} onSelect={inspect}/>
      <p className="text-xs leading-relaxed text-muted-foreground">Hover or focus nodes to trace connections. Select a type or subtype to filter. Scroll inside the diagram to pan. Widths count classification links, not patients, prevalence, or risk. Stages are alternatives, not a progression timeline.</p>
      <Separator/>
      <div aria-live="polite" className="space-y-3">
        <div className="flex items-center gap-2"><h3 className="text-sm font-medium">{selected?.label??(overview?'All body regions':region.name)}</h3>{selected&&<Badge variant="outline">{selected.kind}</Badge>}</div>
        <p className="text-sm leading-relaxed text-muted-foreground">{selected?.note??(overview?'Select a region or cancer type to focus its classification map and synchronize the body model.':region.description)}</p>
        <p className="text-xs text-muted-foreground">Selected examples only. Staging is disease-specific; grades, phases, and disease status are explicitly labeled.</p>
        <div className="flex flex-wrap gap-2">{(selected?.sources??[`https://www.cancer.gov/types/${region.source}`]).slice(0,4).map((source,i)=><Button key={source} variant="outline" size="sm" asChild><a href={source} target="_blank" rel="noreferrer">NCI reference{(selected?.sources.length??0)>1?` ${i+1}`:''}<ArrowUpRight/></a></Button>)}</div>
      </div>
    </CardContent>
  </Card>
  if(!floating)return <aside className="h-[790px] min-w-0 md:col-span-2 xl:col-span-1">{panel}</aside>
  return <><aside className="flex h-32 items-center justify-center rounded-lg border border-dashed md:col-span-2 xl:col-span-1"><Button variant="outline" onClick={()=>setFloating(false)}><PanelRightClose/>Dock cancer map here</Button></aside>{createPortal(<div className="pointer-events-none fixed inset-0 z-40"><Rnd bounds="parent" position={position} size={size} minWidth={Math.min(360,window.innerWidth-32)} minHeight={350} maxWidth={window.innerWidth} maxHeight={window.innerHeight} dragHandleClassName="sankey-drag-handle" cancel="button,a,[role=button]" style={{pointerEvents:'auto'}} onDragStop={(_,d)=>setPosition({x:d.x,y:d.y})} onResizeStop={(_,__,ref,___,pos)=>{setSize({width:ref.offsetWidth,height:ref.offsetHeight});setPosition(pos)}}>{panel}</Rnd></div>,document.body)}</>
}
