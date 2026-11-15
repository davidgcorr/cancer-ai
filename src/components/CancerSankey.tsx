import { useMemo, useState } from 'react'
import { sankey, sankeyLinkHorizontal } from 'd3-sankey'
import type { SankeyNode, SankeyLink } from 'd3-sankey'
import { connectedNodes } from '@/data/cancer-graph'
import type { CancerGraph, FlowNode, FlowLink } from '@/data/cancer-graph'

type LinkData = Omit<FlowLink,'source'|'target'|'value'>
function lines(text: string): string[] {
  const words=text.split(' '),result:string[]=[]
  let line=''
  for(const word of words){if((line+' '+word).trim().length>25&&line){result.push(line);line=word}else line=(line+' '+word).trim()}
  if(line)result.push(line)
  return result
}
export function CancerSankey({ graph, color, zoom, selected, onSelect }: { graph: CancerGraph; color: string; zoom: number; selected?: string; onSelect: (node: FlowNode) => void }) {
  const [hover,setHover]=useState<string>()
  const height=Math.max(400,...[0,1,2,3].map(col=>graph.nodes.filter(n=>n.column===col).length*58+60))
  const width=1000
  const layout=useMemo(()=>sankey<FlowNode,LinkData>().nodeId(n=>n.id).nodeAlign(n=>n.column).nodeWidth(10).nodePadding(28).nodeSort(null).extent([[15,45],[820,height-25]])({nodes:graph.nodes.map(n=>({...n})),links:graph.links.map(l=>({...l}))}),[graph,height])
  const focus=[hover,selected].find(id=>id&&graph.nodes.some(node=>node.id===id))
  const connected=useMemo(()=>focus?connectedNodes(graph,focus):undefined,[graph,focus])
  const path=sankeyLinkHorizontal<FlowNode,LinkData>()
  return <div className="overflow-auto rounded-md border bg-background" style={{maxHeight:500}} aria-label="Scrollable cancer classification Sankey">
    <svg width={`${zoom}%`} style={{minWidth:zoom===100?800:800*zoom/100,display:'block'}} viewBox={`0 0 ${width} ${height}`} role="group" aria-label="Body region to cancer type to subtype to stage or classification. Links represent taxonomy relationships, not patient counts.">
      <g className="fill-muted-foreground text-[11px] font-medium">{['Body region','Cancer type','Subtype','Stage / classification'].map((title,i)=><text key={title} x={15+i*(805/3)} y={22}>{title}</text>)}</g>
      <g fill="none">{layout.links.map((link,i)=>{
        const source=link.source as SankeyNode<FlowNode,LinkData>,target=link.target as SankeyNode<FlowNode,LinkData>
        const lit=!connected||(connected.has(source.id)&&connected.has(target.id))
        return <path key={i} d={path(link as SankeyLink<FlowNode,LinkData>)??''} stroke={color} strokeWidth={Math.max(1,link.width??1)} strokeOpacity={lit?.28:.045} onPointerEnter={()=>setHover(target.id)} onPointerLeave={()=>setHover(undefined)}><title>{source.label} → {target.label}. Classification relationship; not a patient count.</title></path>
      })}</g>
      {layout.nodes.map(node=>{
        const labelLines=lines(node.label),y=((node.y0??0)+(node.y1??0))/2
        return <g key={node.id} role="button" tabIndex={0} aria-label={`${node.label}. ${node.kind==='type'||node.kind==='subtype'?'Select to filter the diagram.':'Select for details.'}`} aria-pressed={selected===node.id}
          className="cursor-pointer outline-none [&:focus>rect]:stroke-foreground [&:focus>rect]:stroke-2" opacity={!connected||connected.has(node.id)?1:.25}
          onClick={()=>onSelect(node)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onSelect(node)}}} onPointerEnter={()=>setHover(node.id)} onPointerLeave={()=>setHover(undefined)} onFocus={()=>setHover(node.id)} onBlur={()=>setHover(undefined)}>
          <title>{node.label}: {node.note}</title>
          <rect x={node.x0} y={node.y0} width={10} height={Math.max(6,(node.y1??0)-(node.y0??0))} rx={2} fill={color} fillOpacity={selected===node.id?1:.8}/>
          <text x={(node.x1??0)+8} y={y-(labelLines.length-1)*7} className="fill-foreground text-[12px]" paintOrder="stroke" stroke="var(--background)" strokeWidth={3} strokeLinejoin="round">{labelLines.map((line,i)=><tspan key={i} x={(node.x1??0)+8} dy={i?14:0}>{line}</tspan>)}</text>
        </g>
      })}
    </svg>
  </div>
}
