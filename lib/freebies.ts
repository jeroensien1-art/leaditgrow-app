export type FreebieId =
  | 'checklist-opvolging'
  | 'template-speedtolead'
  | 'delegatiekader'
  | 'stress-checklist'
  | 'tijdlog'
  | 'promptlijst'
  | 'gespreksgids'

export interface FreebieConfig {
  id: FreebieId
  /** keyword dat in de content gebruikt wordt om deze freebie op te vragen */
  keyword: string
  title: string
  /** één regel op de landingspagina */
  pitch: string
  /** voor wie dit bedoeld is, staat op de kaart */
  voorWie: string
  subject: string
  downloadFile: string
  emailIntro: string
  emailBullets: string[]
}

export const FREEBIES: Record<FreebieId, FreebieConfig> = {
  'delegatiekader': {
    id: 'delegatiekader',
    keyword: 'KADER',
    title: 'Het delegatiekader op 1 A4',
    pitch: 'Waarover beslist je team zelf, waarover jij, en welke fouten zijn aanvaardbaar leergeld. Eén blad, ingevuld in een half uur.',
    voorWie: 'Voor wie tientallen vragen per week krijgt waarvan het team het antwoord zelf kent.',
    subject: 'je delegatiekader op 1 A4',
    downloadFile: 'delegatiekader.pdf',
    emailIntro: 'Zoals beloofd: het delegatiekader staat klaar. Eén blad waarop je vastlegt waarover je team zelf beslist, waarover jij beslist, en welke fouten mogen gemaakt worden.',
    emailBullets: [
      'Vul het in voor één zone van je bedrijf, niet voor alles tegelijk. Dat werkt beter en het is in een half uur klaar.',
      'Deel het daarna met het team in kwestie. Een kader dat niemand gezien heeft, verandert niets.',
    ],
  },
  'stress-checklist': {
    id: 'stress-checklist',
    keyword: 'RUST',
    title: 'De stress-checklist voor zaakvoerders',
    pitch: 'Tien plekken waar ondernemersstress vandaan komt, met per plek de kleinste actie die je vandaag nog kan zetten.',
    voorWie: 'Voor wie het werk mentaal niet meer loslaat, ook in het weekend niet.',
    subject: 'je stress-checklist',
    downloadFile: 'stress-checklist.pdf',
    emailIntro: 'Zoals beloofd: de checklist staat klaar. Tien plekken waar stress bij zaakvoerders vandaan komt, en per plek één actie die je meteen kan zetten.',
    emailBullets: [
      'Loop de tien punten door en kruis aan wat herkenbaar is. Kies er daarna één uit, niet vijf.',
      'De laatste kolom is de belangrijkste: wat leg je vast zodat het niet terugkomt?',
    ],
  },
  'tijdlog': {
    id: 'tijdlog',
    keyword: 'TIJD',
    title: 'Het tijdlog-template van één week',
    pitch: 'Vijf kolommen waarmee je één week bijhoudt waar je uren echt heen gaan, inclusief de kolom voor half afgewerkte taken.',
    voorWie: 'Voor wie het gevoel heeft constant bezig te zijn zonder aan het echte werk toe te komen.',
    subject: 'je tijdlog-template',
    downloadFile: 'tijdlog-template.pdf',
    emailIntro: 'Zoals beloofd: het tijdlog-template staat klaar. Eén week bijhouden, vijf kolommen, en daarna weet je precies welke drie taken je week opeten.',
    emailBullets: [
      'Log tijdens de dag, niet achteraf. Achteraf reconstrueer je wat je dacht te doen, niet wat je deed.',
      'Op vrijdag tel je per categorie op. De top drie is je automatiseer- of delegeerlijst.',
    ],
  },
  'promptlijst': {
    id: 'promptlijst',
    keyword: 'PROMPTS',
    title: 'De promptlijst voor zaakvoerders',
    pitch: 'Het contextblok dat je eenmalig instelt, plus tien prompts voor offertes, klantmails, samenvattingen en opvolging.',
    voorWie: 'Voor wie AI al probeerde en enkel generieke antwoorden terugkreeg.',
    subject: 'je promptlijst voor zaakvoerders',
    downloadFile: 'promptlijst.pdf',
    emailIntro: 'Zoals beloofd: de promptlijst staat klaar. Begin bij deel 1, het contextblok. Dat is de stap die het verschil maakt tussen generieke output en iets dat klinkt als jouw bedrijf.',
    emailBullets: [
      'Zet het contextblok eenmalig in de instructies van je AI-tool. Tien minuten werk, daarna vertrekt elke opdracht van die basis.',
      'Bewaar de prompts die bij jou werken in een eigen lijstje. Een goede prompt vind je nooit twee keer opnieuw uit.',
    ],
  },
  'gespreksgids': {
    id: 'gespreksgids',
    keyword: 'GESPREK',
    title: 'Vijf moeilijke gesprekken, uitgeschreven',
    pitch: 'Van openingszin tot afsluiting: het slechtnieuwsgesprek, de te trage medewerker, de klacht, de prijsverhoging en het functioneringsgesprek.',
    voorWie: 'Voor wie een gesprek al weken uitstelt omdat de eerste zin niet komt.',
    subject: 'je gids met vijf moeilijke gesprekken',
    downloadFile: 'gespreksgids.pdf',
    emailIntro: 'Zoals beloofd: de gespreksgids staat klaar. Vijf gesprekken die elke zaakvoerder vroeg of laat moet voeren, volledig uitgeschreven van opening tot afsluiting.',
    emailBullets: [
      'Lees enkel het gesprek dat je nu nodig hebt. De rest komt vanzelf aan de beurt.',
      'De openingszin is het belangrijkste deel. Die bepaalt of de rest een gesprek wordt of een verdediging.',
    ],
  },
  'checklist-opvolging': {
    id: 'checklist-opvolging',
    keyword: 'CHECKLIST',
    title: '5 signalen dat je opvolging lekt',
    pitch: 'Vijf plekken waar leads verdwijnen tussen aanvraag en eerste antwoord, en hoe je ze een voor een dichtzet.',
    voorWie: 'Voor wie leads binnenkrijgt maar te weinig klanten overhoudt.',
    subject: 'je checklist "5 signalen dat je opvolging lekt"',
    downloadFile: 'checklist-opvolging.pdf',
    emailIntro: 'Zoals beloofd: de checklist staat klaar. Vijf signalen die laten zien waar je lead-opvolging vandaag lekt, voor je het zelf doorhebt.',
    emailBullets: [
      'Loop de vijf signalen na tegen je eigen bedrijf, geen enquête nodig, je weet het antwoord meestal meteen.',
      'Herken je er twee of meer? Begin bij het signaal met het minste werk om op te lossen.',
    ],
  },
  'template-speedtolead': {
    id: 'template-speedtolead',
    keyword: 'TEMPLATE',
    title: 'Speed-to-lead e-mailtemplate',
    pitch: 'Eén kant-en-klare e-mail die je binnen twee minuten na een nieuwe aanvraag verstuurt. Kopiëren, haakjes vervangen, klaar.',
    voorWie: 'Voor wie op de baan zit terwijl de aanvragen binnenkomen.',
    subject: 'je speed-to-lead e-mailtemplate',
    downloadFile: 'template-speedtolead.pdf',
    emailIntro: 'Zoals beloofd: de template staat klaar. Eén kant-en-klare e-mail die je binnen twee minuten na een nieuwe lead kan versturen.',
    emailBullets: [
      'Kopieer de template, vervang de haakjes, klaar. Geen tool of setup nodig.',
      'Gebruik hem als basis voor je eigen automatische opvolgmail zodra je daar klaar voor bent.',
    ],
  },
}

/** volgorde op de landingspagina: nieuw en zwaarst gevraagd eerst */
export const FREEBIE_ORDER: FreebieId[] = [
  'delegatiekader',
  'tijdlog',
  'stress-checklist',
  'promptlijst',
  'gespreksgids',
  'checklist-opvolging',
  'template-speedtolead',
]
