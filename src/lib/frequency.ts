import type { Frequency } from '../data/cancer-evidence'
const percentage=(value:unknown):value is number=>typeof value==='number'&&Number.isFinite(value)&&value>=0&&value<=100
export function hasPublishedFrequency(frequency?:Frequency):boolean {
 if(!frequency||!frequency.source.startsWith('https://')||![frequency.denominator,frequency.population,frequency.period,frequency.note].every(value=>value.trim().length>0))return false
 return percentage(frequency.value)||(frequency.qualifier==='range'&&percentage(frequency.min)&&percentage(frequency.max)&&frequency.min<=frequency.max)
}
export function formatFrequency(frequency:Frequency|undefined,language:string):string {
 if(!hasPublishedFrequency(frequency))return ''
 const percent=new Intl.NumberFormat(language,{style:'percent',maximumFractionDigits:1})
 if(frequency!.value===undefined)return `${percent.format(frequency!.min!/100)}–${percent.format(frequency!.max!/100)}`
 return `${frequency!.qualifier==='greater'?'>':frequency!.qualifier==='approximate'?'≈':''}${percent.format(frequency!.value/100)}`
}
