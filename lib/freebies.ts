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
  /** één regel op de landingspagina: wat het is */
  pitch: string
  /** wat er concreet verandert nadat je het gebruikt hebt, met tijdsinvestering */
  uitkomst: string
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
    pitch: 'Waarover beslist je team zelf, waarover jij, en welke fouten zijn aanvaardbaar leergeld. Eén blad om in te vullen.',
    uitkomst: 'Na een half uur ligt op één blad vast waarover je team zonder jou beslist. De vragen die je nu wekelijks krijgt, vallen grotendeels weg.',
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
    uitkomst: 'Na tien minuten weet je welke slepende situatie je het meest kost, heb je de eerste actie gezet, en staat de afspraak die voorkomt dat ze terugkomt.',
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
    uitkomst: 'Na één week weet je precies welke drie taken je agenda opeten, hoeveel uren dat zijn, en welke daarvan iemand anders of een systeem kan overnemen.',
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
    uitkomst: 'Na tien minuten instellen schrijft AI je offertes en klantmails in jouw stem in plaats van in brochuretaal. Een offerte die je nu herschrijft, is dan in dertig seconden verzendklaar.',
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
    uitkomst: 'Je hebt de openingszin, de structuur en de valkuil van het gesprek dat je nu uitstelt. Genoeg om het deze week te voeren in plaats van volgende maand.',
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
    uitkomst: 'Na een kwartier weet je op welke van de vijf plekken jouw leads weglekken, en welke daarvan je deze week nog dichtzet zonder tool of budget.',
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
    uitkomst: 'Vanaf vandaag krijgt elke nieuwe aanvraag binnen twee minuten een persoonlijk antwoord met een concrete volgende stap, ook als jij op de baan zit. Dat is het verschil tussen eerst zijn en te laat.',
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

/**
 * Volgorde op de landingspagina, van meest naar minst bepalend voor omzet.
 * Speed-to-lead eerst: dat is de kortste weg van freebie naar meer klanten,
 * en het sluit aan op wat we verkopen. Daarna de rest van de lead-opvolging,
 * dan de tools die tijd vrijmaken, en tot slot de mens- en gesprekskant.
 */
export const FREEBIE_ORDER: FreebieId[] = [
  'template-speedtolead',
  'checklist-opvolging',
  'promptlijst',
  'delegatiekader',
  'tijdlog',
  'stress-checklist',
  'gespreksgids',
]
