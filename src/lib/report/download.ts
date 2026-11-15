import { translate } from '../i18n/core.ts'
import type { ReportModel } from './model.ts'
import { reportHtml } from './model.ts'
function download(blob:Blob,name:string) {
 const url=URL.createObjectURL(blob),link=document.createElement('a')
 link.href=url;link.download=name;document.body.appendChild(link);link.click();link.remove()
 window.setTimeout(()=>URL.revokeObjectURL(url),30000)
}
export function downloadHtml(report:ReportModel) {download(new Blob([reportHtml(report)],{type:'text/html;charset=utf-8'}),filename(report,'html'))}
function filename(report:ReportModel,extension:string) {return `onco-milver-${report.regionId}-${report.language}-${report.createdAt.slice(0,10)}.${extension}`}
export async function downloadPng(report:ReportModel) {
 await document.fonts.ready
 const width=1400,margin=56,contentWidth=width-margin*2,canvas=document.createElement('canvas'),ctx=canvas.getContext('2d')
 if(!ctx)throw new Error('Canvas unavailable')
 type Command={text?:string;x:number;y:number;size?:number;bold?:boolean;color?:string;image?:HTMLImageElement;card?:boolean;w?:number;h?:number}
 const commands:Command[]=[];let y=margin
 const text=(value:string,size=18,bold=false,color='#18181b',x=margin,maxWidth=contentWidth)=>{
  ctx.font=`${bold?'600':'400'} ${size}px Arial, sans-serif`
  // Break at character boundaries when a single URL/word exceeds the line width.
  for(const paragraph of value.split('\n')) {
   let line=''
   for(const word of paragraph.split(' ')) {
    if(line&&ctx.measureText(`${line} ${word}`).width>maxWidth){commands.push({text:line,x,y,size,bold,color});y+=size*1.5;line=''}
    if(ctx.measureText(word).width>maxWidth){for(const char of word){if(ctx.measureText(line+char).width>maxWidth){commands.push({text:line,x,y,size,bold,color});y+=size*1.5;line=''}line+=char}}else line+=(line?' ':'')+word
   }
   if(line){commands.push({text:line,x,y,size,bold,color});y+=size*1.5}
  }
  y+=8
 }
 const t=(key:string)=>translate(report.language,key)
 text('onco-milver',22,true);text(report.title,34,true);text(report.path.join(' → '),16,false,'#52525b')
 text(`${t('Report scope')}: ${report.scope} · ${t('Body model')}: ${report.gender}`,16)
 text(`${t('Generated')}: ${report.createdAt} · ${t('Content reviewed')}: ${report.reviewedOn}`,14,false,'#52525b')
 text(report.notice,15);if(report.stageNotice)text(report.stageNotice,15);text(report.coverage,15);if(report.frequencyNotice)text(report.frequencyNotice,15);text(t('Widths count classification links, not patient frequency.'),14,false,'#52525b')
 const image=new Image(),url=URL.createObjectURL(new Blob([report.diagram],{type:'image/svg+xml;charset=utf-8'}))
 try {await new Promise<void>((resolve,reject)=>{image.onload=()=>resolve();image.onerror=()=>reject(new Error('Diagram image could not be rendered'));image.src=url})}finally{URL.revokeObjectURL(url)}
 const diagramHeight=image.naturalHeight*(contentWidth/image.naturalWidth)
 commands.push({image,x:margin,y,w:contentWidth,h:diagramHeight});y+=diagramHeight+32
 for(const entry of report.entries) {
  y+=20;text(entry.family,16,false,'#52525b');text(entry.label,26,true)
  if(entry.frequency){text(`${t('Share among site cases')}: ${entry.frequency}`,20,true);entry.frequencyDetails.forEach(value=>text(value,15,false,'#52525b'))}
  text(entry.classification,20,true);text(entry.stages.join(' · '),17);text(entry.note,16)
  text(t('Main treatment options'),20,true);entry.treatments.forEach(option=>{
   const top=y,index=commands.length;y+=14
   text(option,17,true,'#18181b',margin+16,contentWidth-32);y+=6
   commands.splice(index,0,{card:true,x:margin,y:top,w:contentWidth,h:y-top});y+=10
  });text(entry.treatmentContext,15,false,'#52525b')
  text(t('Sources'),18,true);entry.sources.forEach(source=>text(source,13,false,report.color))
 }
 text(report.notice,15);y+=margin
 if(y>30000||width*y>32000000)throw new Error('Report image is too large; export HTML or choose a smaller branch.')
 canvas.width=width;canvas.height=Math.ceil(y);ctx.fillStyle='#ffffff';ctx.fillRect(0,0,width,canvas.height);ctx.textBaseline='top'
 for(const command of commands) {
  if(command.card){ctx.beginPath();ctx.roundRect(command.x,command.y,command.w!,command.h!,8);ctx.fillStyle='#fafafa';ctx.fill();ctx.strokeStyle='#d4d4d8';ctx.lineWidth=1;ctx.stroke()}
  else if(command.image)ctx.drawImage(command.image,command.x,command.y,command.w!,command.h!)
  else{ctx.font=`${command.bold?'600':'400'} ${command.size}px Arial, sans-serif`;ctx.fillStyle=command.color??'#18181b';ctx.fillText(command.text??'',command.x,command.y)}
 }
 const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(new Error('PNG export failed')),'image/png'))
 download(blob,filename(report,'png'))
}
