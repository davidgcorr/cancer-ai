import { messages } from './messages.ts'
export const languages = { en: 'English', es: 'Español', fr: 'Français', de: 'Deutsch' } as const
export type Language = keyof typeof languages
export function isLanguage(value: unknown): value is Language { return typeof value === 'string' && Object.hasOwn(languages, value) }
export function savedLanguage(): Language {
  try { const value = localStorage.getItem('onco-milver-language'); return isLanguage(value) ? value : 'en' } catch { return 'en' }
}
export function translate(language: Language, text: string, values?: Record<string, string | number>): string {
  let result = text
  if (language !== 'en') {
    const index = { es: 0, fr: 1, de: 2 }[language]
    const entry = messages[text]
    if (entry) result = entry[index]
    else if (/^(.+) \((L|R)\)$/.test(text)) {
      const match = /^(.+) \((L|R)\)$/.exec(text)!
      result = `${translate(language,match[1])} (${translate(language,match[2] === 'L' ? 'Left' : 'Right')})`
    }
    else if (/^Stage [0IVABC]+$/.test(text)) result = `${['Estadio','Stade','Stadium'][index]} ${text.slice(6)}`
    else if (/^Grade [1-4]$/.test(text)) result = `${['Grado','Grade','Grad'][index]} ${text.slice(6)}`
    else if (/^(Rai|ISS) [0IV]+$/.test(text)) result = text
    else {
      // Graph detail notes compose a classification system and its explanation.
      // Translate each authored segment without altering stable graph IDs.
      const boundary = text.indexOf('. ')
      if (boundary >= 0) result = `${translate(language,text.slice(0,boundary))}. ${translate(language,text.slice(boundary+2))}`
    }
  }
  if (values) for (const [key,value] of Object.entries(values)) result = result.replaceAll(`{${key}}`,String(value))
  return result
}
export function hasTranslation(text: string): boolean {
  if (messages[text] || /^(Stage [0IVABC]+|Grade [1-4]|(Rai|ISS) [0IV]+)$/.test(text)) return true
  const side = /^(.+) \((L|R)\)$/.exec(text)
  if (side) return hasTranslation(side[1])
  const boundary = text.indexOf('. ')
  return boundary >= 0 && hasTranslation(text.slice(0,boundary)) && hasTranslation(text.slice(boundary+2))
}
