export type FreebieId = 'checklist-opvolging' | 'template-speedtolead'

export interface FreebieConfig {
  id: FreebieId
  title: string
  subject: string
  downloadFile: string
  emailIntro: string
  emailBullets: string[]
}

export const FREEBIES: Record<FreebieId, FreebieConfig> = {
  'checklist-opvolging': {
    id: 'checklist-opvolging',
    title: '5 signalen dat je opvolging lekt',
    subject: 'je checklist "5 signalen dat je opvolging lekt"',
    downloadFile: 'checklist-opvolging.pdf',
    emailIntro: 'Zoals beloofd: de checklist staat klaar. Vijf signalen die laten zien waar je lead-opvolging vandaag lekt, voor je het zelf doorhebt.',
    emailBullets: [
      'Loop de vijf signalen na tegen je eigen bedrijf, geen enquête nodig — je weet het antwoord meestal meteen.',
      'Herken je er twee of meer? Begin bij het signaal met het minste werk om op te lossen.',
    ],
  },
  'template-speedtolead': {
    id: 'template-speedtolead',
    title: 'Speed-to-lead e-mailtemplate',
    subject: 'je speed-to-lead e-mailtemplate',
    downloadFile: 'template-speedtolead.pdf',
    emailIntro: 'Zoals beloofd: de template staat klaar. Eén kant-en-klare e-mail die je binnen twee minuten na een nieuwe lead kan versturen.',
    emailBullets: [
      'Kopieer de template, vervang de haakjes, klaar. Geen tool of setup nodig.',
      'Gebruik hem als basis voor je eigen automatische opvolgmail zodra je daar klaar voor bent.',
    ],
  },
}
