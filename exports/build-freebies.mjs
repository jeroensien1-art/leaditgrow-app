// Genereert de freebie-PDF's uit HTML met print-CSS, via headless Chrome.
// Draaien: node exports/build-freebies.mjs
import { writeFileSync, mkdirSync, existsSync, rmSync } from 'fs'
import { execFileSync } from 'child_process'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const HIER = dirname(fileURLToPath(import.meta.url))
const UIT = resolve(HIER, '../public/downloads')
const TMP = resolve(HIER, '.tmp-freebies')
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const CSS = `
@page { size: A4; margin: 18mm 16mm; }
* { box-sizing: border-box; }
body { font-family: Georgia, 'Times New Roman', serif; color: #2a2721; line-height: 1.6; font-size: 10.5pt; margin: 0; }
h1 { font-size: 25pt; line-height: 1.12; margin: 0 0 6pt; font-weight: normal; color: #0a1e10; }
.sub { font-size: 11pt; color: #6b675d; margin: 0 0 4pt; font-style: italic; }
.merk { font-family: 'Courier New', monospace; font-size: 8pt; letter-spacing: 0.16em; text-transform: uppercase; color: #c96442; margin: 0 0 14pt; }
h2 { font-size: 13.5pt; margin: 20pt 0 7pt; color: #0a1e10; font-weight: normal; border-bottom: 1.5px solid #c96442; padding-bottom: 4pt; break-after: avoid; }
h3 { font-size: 11pt; margin: 13pt 0 4pt; color: #0a1e10; break-after: avoid; }
p { margin: 0 0 8pt; orphans: 3; widows: 3; }
ul, ol { margin: 0 0 9pt; padding-left: 15pt; }
li { margin-bottom: 4pt; }
.blok { border: 1px solid #d8d4c8; padding: 11pt 13pt; margin: 0 0 11pt; background: #faf9f5; break-inside: avoid; }
.blok h3 { margin-top: 0; }
.prompt { font-family: 'Courier New', monospace; font-size: 9pt; background: #f2f0eb; border-left: 3px solid #c96442; padding: 9pt 11pt; margin: 0 0 10pt; white-space: pre-wrap; break-inside: avoid; }
table { width: 100%; border-collapse: collapse; margin: 0 0 11pt; font-size: 9pt; break-inside: avoid; }
th { background: #0a1e10; color: #faf9f5; text-align: left; padding: 6pt 7pt; font-weight: normal; font-size: 8.5pt; }
td { border: 1px solid #d8d4c8; padding: 7pt; vertical-align: top; height: 30pt; }
.hint { font-size: 9pt; color: #6b675d; font-style: italic; }
.voet { margin-top: 22pt; padding-top: 9pt; border-top: 1px solid #d8d4c8; font-size: 8.5pt; color: #6b675d; }
.nieuw { break-before: page; }
`

const html = (t, sub, body) => `<!DOCTYPE html><html lang="nl"><head><meta charset="utf-8"><title>${t}</title><style>${CSS}</style></head><body>
<p class="merk">Lead it, Grow · leaditgrow.be</p><h1>${t}</h1><p class="sub">${sub}</p>${body}
<div class="voet">Gemaakt door Lead it, Grow. Vrij te gebruiken binnen je eigen bedrijf. Vragen? jeroen@leaditgrow.be</div>
</body></html>`

const rij = (n = 8) => Array.from({ length: n }, () => '<tr><td></td><td></td><td></td><td></td><td></td></tr>').join('')

const FREEBIES = [
  {
    file: 'delegatiekader',
    titel: 'Het delegatiekader op 1 A4',
    sub: 'Waarover beslist je team zelf, waarover jij, en welke fouten mogen gemaakt worden.',
    body: `
<p>De meeste medewerkers vragen geen toestemming omdat ze het antwoord niet kennen. Ze vragen toestemming omdat storen veiliger voelt dan een fout maken. Zolang niemand heeft uitgesproken waar de grens ligt, kiest een team altijd de veiligste optie: wachten op jou.</p>
<p>Dit kader lost dat op door de grens één keer op te schrijven. Vul het in voor één zone of één team, niet voor je hele bedrijf tegelijk. Reken op een half uur.</p>

<h2>Stap 1 · Kies je zone</h2>
<p>Eén afdeling, één type klant of één proces. Bijvoorbeeld: offertes onder een bepaald bedrag, planning van de week, klachten van bestaande klanten.</p>
<div class="blok"><h3>Zone</h3><p>&nbsp;</p><h3>Wie is hier verantwoordelijk?</h3><p>&nbsp;</p></div>

<h2>Stap 2 · Verdeel de beslissingen</h2>
<p>Schrijf per rij een beslissing op die in deze zone regelmatig terugkomt, en zet ze in de juiste kolom. Twijfel je, zet ze dan bij het team met een bedrag- of tijdgrens erbij.</p>
<table>
<tr><th style="width:44%">Beslissing</th><th style="width:28%">Team beslist zelf</th><th style="width:28%">Jij beslist</th></tr>
${Array.from({ length: 9 }, () => '<tr><td></td><td></td><td></td></tr>').join('')}
</table>
<p class="hint">Vuistregel: alles wat omkeerbaar is en onder een bedrag blijft dat je zonder pijn kan missen, hoort bij het team.</p>

<h2 class="nieuw">Stap 3 · Benoem de aanvaardbare fouten</h2>
<p>Dit is het deel dat bijna nooit uitgesproken wordt, en net daarom blijft iedereen vragen. Zolang je team niet weet welke fout mag, gaat het ervan uit dat geen enkele fout mag.</p>
<table>
<tr><th style="width:60%">Deze fout mag gemaakt worden</th><th style="width:40%">Wat we dan doen</th></tr>
${Array.from({ length: 5 }, () => '<tr><td></td><td></td></tr>').join('')}
</table>

<h2>Stap 4 · Spreek de escalatie af</h2>
<p>Er blijven situaties waarin je team jou wél moet halen. Maak die expliciet, anders wordt elke twijfel een reden om te bellen.</p>
<div class="blok">
<h3>Kom naar mij als:</h3>
<ul><li>het over meer gaat dan een bedrag van ......................</li><li>de klant expliciet vraagt om de zaakvoerder</li><li>de beslissing niet terug te draaien is</li><li>........................................................................</li><li>........................................................................</li></ul>
</div>

<h2>Stap 5 · Deel het en test het</h2>
<ul>
<li>Geef dit blad aan het team in kwestie en overloop het samen. Een kader dat niemand gezien heeft, verandert niets.</li>
<li>Spreek een proefperiode van één maand af. Zeg er expliciet bij dat er in die maand fouten mogen vallen.</li>
<li>Reageer op de eerste zelfstandige beslissing met steun, ook als je het zelf anders had gedaan. Die eerste reactie bepaalt of er een tweede komt.</li>
<li>Na een maand: welke vragen kreeg je nog? Die horen in de tabel van stap 2.</li>
</ul>
<p class="hint">Blijft de stroom vragen aanhouden, dan is het kader meestal niet fout maar te vaag. Vervang woorden als "belangrijk" of "groot" door bedragen, aantallen en termijnen.</p>`,
  },
  {
    file: 'tijdlog-template',
    titel: 'Het tijdlog-template van één week',
    sub: 'Vijf kolommen, vijf dagen. Daarna weet je welke drie taken je week opeten.',
    body: `
<p>Bijna elke zaakvoerder onderschat waar zijn tijd heen gaat. Niet uit onachtzaamheid, maar omdat de grootste tijdvreters zelden groot genoeg zijn om apart in te plannen. Ze zijn klein, ze komen tussendoor, en samen zijn ze je halve week.</p>
<p>Deze oefening kost je vijf keer twee minuten. Log tijdens de dag, niet achteraf: achteraf reconstrueer je wat je dacht te doen, niet wat je deed.</p>

<h2>Zo vul je in</h2>
<ul>
<li><strong>Tijd</strong> · van wanneer tot wanneer, geen precisie op de minuut nodig.</li>
<li><strong>Wat</strong> · in gewone woorden, zoals je het aan iemand zou vertellen.</li>
<li><strong>Categorie</strong> · kies uit de lijst hieronder.</li>
<li><strong>Kon iemand anders dit?</strong> · ja, nee, of "ja mits", en dan wat er dan moet bestaan.</li>
<li><strong>Af?</strong> · af, of half. Half tellen we apart, want die komen terug.</li>
</ul>
<div class="blok"><h3>Categorieën</h3><p>KLANT (gesprek, bezoek, opvolging) · OFFERTE · ADMIN (facturen, boekhouding, papier) · MAIL · INTERN (vragen van je team, overleg) · WERF of UITVOERING · STRATEGIE (bouwen, plannen, nadenken) · ONDERBREKING</p></div>

<h2>Dag 1</h2>
<table><tr><th style="width:12%">Tijd</th><th style="width:34%">Wat</th><th style="width:16%">Categorie</th><th style="width:26%">Kon iemand anders dit?</th><th style="width:12%">Af?</th></tr>${rij(9)}</table>

<h2 class="nieuw">Dag 2</h2>
<table><tr><th style="width:12%">Tijd</th><th style="width:34%">Wat</th><th style="width:16%">Categorie</th><th style="width:26%">Kon iemand anders dit?</th><th style="width:12%">Af?</th></tr>${rij(9)}</table>

<h2>Dag 3</h2>
<table><tr><th style="width:12%">Tijd</th><th style="width:34%">Wat</th><th style="width:16%">Categorie</th><th style="width:26%">Kon iemand anders dit?</th><th style="width:12%">Af?</th></tr>${rij(9)}</table>

<h2 class="nieuw">Dag 4</h2>
<table><tr><th style="width:12%">Tijd</th><th style="width:34%">Wat</th><th style="width:16%">Categorie</th><th style="width:26%">Kon iemand anders dit?</th><th style="width:12%">Af?</th></tr>${rij(9)}</table>

<h2>Dag 5</h2>
<table><tr><th style="width:12%">Tijd</th><th style="width:34%">Wat</th><th style="width:16%">Categorie</th><th style="width:26%">Kon iemand anders dit?</th><th style="width:12%">Af?</th></tr>${rij(9)}</table>

<h2 class="nieuw">De weekanalyse</h2>
<p>Tel op vrijdag per categorie de uren op. Dan pas wordt het interessant.</p>
<table>
<tr><th style="width:34%">Categorie</th><th style="width:22%">Uren deze week</th><th style="width:44%">Hoeveel daarvan kon iemand anders?</th></tr>
${Array.from({ length: 8 }, () => '<tr><td></td><td></td><td></td></tr>').join('')}
</table>
<h3>Drie vragen om af te sluiten</h3>
<ol>
<li>Welke categorie kostte het meest, en had je dat verwacht?</li>
<li>Hoeveel regels kregen "ja" of "ja mits" in kolom vier? Die uren zijn je delegeer- en automatiseerbudget.</li>
<li>Hoeveel taken staan op "half"? Die komen volgende week terug, plus de tijd om er weer in te komen.</li>
</ol>
<p class="hint">Doe deze oefening één keer per kwartaal. Niet vaker, dan wordt het administratie. Niet minder, want de sluipende taken komen terug.</p>`,
  },
  {
    file: 'stress-checklist',
    titel: 'De stress-checklist voor zaakvoerders',
    sub: 'Tien plekken waar de druk vandaan komt, met per plek de kleinste actie die vandaag al kan.',
    body: `
<p>Stress bij zaakvoerders komt zelden van het werk zelf. Ze komt van dingen die open blijven staan: een gesprek dat je uitstelt, een klant die niets hoort, een beslissing die op jou wacht. Je weet dat ze niet vanzelf oplossen, en precies dat weten kost energie.</p>
<p>Loop de tien punten hieronder door en kruis aan wat herkenbaar is. Kies er daarna één uit. Niet vijf, één. De kleinste actie die vandaag al kan is bijna altijd genoeg om iets in beweging te krijgen.</p>

<h2>De tien</h2>
<table>
<tr><th style="width:6%">✓</th><th style="width:50%">Herken je dit?</th><th style="width:44%">De kleinste actie vandaag</th></tr>
<tr><td></td><td>Er is een gesprek dat je al langer dan een maand uitstelt.</td><td>Zet het in je agenda voor deze week, met een uur erbij.</td></tr>
<tr><td></td><td>Er staan dossiers open die voor tachtig procent klaar zijn.</td><td>Kies het dossier dat het snelst af kan en werk het vandaag af.</td></tr>
<tr><td></td><td>Er is een klant met een klacht die al even niets gehoord heeft.</td><td>Bel zelf. Ook zonder oplossing. Het contact is het punt.</td></tr>
<tr><td></td><td>Je hebt geen enkel dagdeel per week waarin je onbereikbaar bent.</td><td>Blokkeer twee uur in je agenda en zeg het je team.</td></tr>
<tr><td></td><td>Er liggen beslissingen te wachten die alleen jij kan nemen.</td><td>Neem de omkeerbare vandaag. Enkel onomkeerbare verdienen tijd.</td></tr>
<tr><td></td><td>Je cijfers zijn niet actueel, dus je beslist op gevoel.</td><td>Vraag je boekhouder wat er nodig is voor een maandelijkse stand.</td></tr>
<tr><td></td><td>Iemand functioneert niet goed en weet dat zelf niet.</td><td>Plan een gesprek van twintig minuten. Niet om te corrigeren, om te benoemen.</td></tr>
<tr><td></td><td>Je maakt afspraken met jezelf die je structureel niet nakomt.</td><td>Schrap er één in plaats van hem opnieuw te verzetten.</td></tr>
<tr><td></td><td>Als jij een week wegvalt, weet niemand wat er moet gebeuren.</td><td>Schrijf op één blad wat er dan moet doorlopen en wie wat doet.</td></tr>
<tr><td></td><td>Het werk gaat mentaal mee naar huis, elke avond opnieuw.</td><td>Bouw twintig minuten tussen kantoor en thuis in. Wandel, fiets, iets.</td></tr>
</table>

<h2 class="nieuw">De ene die je koos</h2>
<div class="blok">
<h3>Welk punt pak je aan?</h3><p>&nbsp;</p>
<h3>Wat is de kleinste actie die je vandaag nog zet?</h3><p>&nbsp;</p>
<h3>Wanneer doe je dat? (datum en uur)</h3><p>&nbsp;</p>
</div>

<h2>En dan de stap die iedereen overslaat</h2>
<p>Eén situatie oplossen voelt goed. Maar als er niets verandert aan hoe ze ontstond, staat ze binnen het kwartaal opnieuw op je lijst. Leg dus vast wat er structureel anders moet, en zorg dat de mensen die het aangaat het weten.</p>
<div class="blok">
<h3>Wat spreken we af zodat dit niet terugkomt?</h3><p>&nbsp;</p><p>&nbsp;</p>
<h3>Wie moet dat weten?</h3><p>&nbsp;</p>
</div>
<p class="hint">Als je merkt dat je op meer dan zes van de tien punten "ja" antwoordt, is er zelden één probleem. Dan leunt er te veel op één persoon, en dat los je niet op met een to-do lijst maar met een systeem. De gratis diagnose op leaditgrow.be brengt in vier minuten in kaart waar dat begint.</p>`,
  },
  {
    file: 'promptlijst',
    titel: 'De promptlijst voor zaakvoerders',
    sub: 'Eerst het contextblok, dan tien prompts voor het werk dat elke week terugkomt.',
    body: `
<p>AI geeft generieke antwoorden omdat het je bedrijf niet kent, niet omdat de technologie tekortschiet. Wie een opdracht geeft zonder te vertellen wie hij is, wat hij verkoopt en hoe hij klinkt, krijgt brochuretaal terug.</p>
<p>Deel 1 is daarom belangrijker dan de rest van dit document. Tien minuten werk, één keer.</p>

<h2>Deel 1 · Het contextblok</h2>
<p>Elke serieuze AI-tool heeft een plek voor vaste instructies: custom instructions, projectinstructies of een systeem-prompt. Vul onderstaand blok in en zet het daar. Vanaf dan vertrekt elke opdracht van die basis.</p>
<div class="prompt">Over mijn bedrijf
- Naam en sector: [.....]
- Regio en taal: [.....]
- Grootte: [aantal medewerkers]

Wat we doen
- Diensten of producten: [.....]
- Prijsklasse: [.....]
- Wat we bewust NIET doen: [.....]

Voor wie
- Typische klant, in gewone woorden: [.....]
- Waar die klant wakker van ligt: [.....]

Hoe ik klink
- Aanspreking: [je of u]
- Toon: [direct, warm, formeel, ...]
- Uitdrukkingen die ik vaak gebruik: [.....]
- Woorden die ik nooit gebruik: [.....]

Regels
- Schrijf in het Nederlands, Vlaams taalgebruik.
- Geen overdreven claims, geen jargon zonder uitleg.
- Vraag door als je iets niet weet, verzin nooit cijfers of namen.</div>
<p class="hint">Plak er ook twee of drie echte mails van jezelf bij, met de instructie: "dit is hoe ik schrijf, gebruik deze toon". Dat werkt beter dan elke omschrijving.</p>

<h2 class="nieuw">Deel 2 · Tien prompts</h2>

<h3>1. Offerte uit een gesprek</h3>
<div class="prompt">Hier is mijn verslag van een klantgesprek. Stel me eerst drie vragen over wat ontbreekt, en schrijf daarna een offerte-tekst in mijn toon. Prijs laat je open, die vul ik zelf in.

[verslag]</div>

<h3>2. Antwoord op een prijsvraag</h3>
<div class="prompt">Een prospect vraagt of het goedkoper kan. Schrijf een antwoord dat de prijs niet verlaagt maar de waarde uitlegt, in maximaal acht zinnen. Vriendelijk, niet defensief.

Context: [wat we aanbieden, wat de klant belangrijk vindt]</div>

<h3>3. Opvolgmail op een offerte</h3>
<div class="prompt">Schrijf drie korte opvolgmails voor een offerte die blijft liggen: een na 2 dagen, een na 5 dagen, een laatste na 12 dagen. Elk maximaal zes zinnen, elk met een andere invalshoek, geen enkele die klinkt als aandringen.</div>

<h3>4. Klacht beantwoorden</h3>
<div class="prompt">Hier is een klacht van een klant. Vat eerst samen wat het echte probleem is, los van de toon. Schrijf daarna een antwoord dat erkent, uitlegt en een concrete volgende stap voorstelt.

[klacht]</div>

<h3>5. Vergadering naar actiepunten</h3>
<div class="prompt">Zet deze notities om in actiepunten met verantwoordelijke en deadline. Zet apart wat nog beslist moet worden. Verzin niets: staat iets er niet in, zet het bij "onduidelijk".

[notities]</div>

<h3>6. Lang document samenvatten</h3>
<div class="prompt">Vat dit document samen in maximaal tien zinnen, gericht op wat ik als zaakvoerder moet beslissen of ondernemen. Geef daaronder de drie punten waar risico zit.

[document]</div>

<h3 class="nieuw">7. Vacature schrijven</h3>
<div class="prompt">Schrijf een vacature voor [functie]. Wees expliciet over de zware kanten van de job, niet enkel de leuke. Beschrijf de functie in verwachte resultaten, niet in een takenlijst. Sluit af met wat iemand hier op een jaar leert.</div>

<h3>8. Voorbereiding van een moeilijk gesprek</h3>
<div class="prompt">Ik moet een gesprek voeren over [onderwerp] met [rol]. Geef me een openingszin, drie punten die ik zeker moet zeggen, en de twee reacties die ik het meest kan verwachten met hoe ik daarop antwoord.</div>

<h3>9. Wekelijkse opvolging sorteren</h3>
<div class="prompt">Hier is mijn lijst met openstaande offertes en contacten. Sorteer op wie vandaag aandacht nodig heeft, en leg per keuze in één zin uit waarom.

[lijst]</div>

<h3>10. Tekst controleren op mijn stem</h3>
<div class="prompt">Herschrijf onderstaande tekst zodat hij klinkt zoals ik schrijf volgens mijn instructies. Haal alle marketingtaal eruit. Varieer de zinslengte. Geen woorden als "naadloos", "krachtig" of "op maat".

[tekst]</div>

<h2 class="nieuw">Deel 3 · Vier gewoontes</h2>
<ol>
<li><strong>Geef nooit een taak zonder doel.</strong> "Schrijf een offerte" is geen opdracht. "Schrijf een offerte voor een klant die twijfelt over de prijs, benadruk de garantie" wel.</li>
<li><strong>Laat het eerst vragen stellen.</strong> Sluit je prompt af met "stel me eerst drie vragen voor je begint". Dat verdubbelt de bruikbaarheid van wat je terugkrijgt.</li>
<li><strong>Werk met je eigen voorbeelden.</strong> Laat je vijf laatste offertes lezen voor er een nieuwe geschreven wordt.</li>
<li><strong>Bewaar wat werkt.</strong> Een prompt die één keer goed werkte, komt terug. Zet hem in een lijstje in plaats van hem opnieuw uit te vinden.</li>
</ol>
<p class="hint">Werk je met klantgegevens? Gebruik de zakelijke versie van je tool en zet het gebruik van je data voor training uit. Bij de meeste tools is dat één schakelaar in de instellingen.</p>`,
  },
  {
    file: 'gespreksgids',
    titel: 'Vijf moeilijke gesprekken, uitgeschreven',
    sub: 'Van openingszin tot afsluiting. Lees enkel het gesprek dat je nu nodig hebt.',
    body: `
<p>De meeste moeilijke gesprekken worden niet uitgesteld omdat ze moeilijk zijn, maar omdat de eerste zin niet komt. Hieronder staan vijf gesprekken die elke zaakvoerder vroeg of laat voert, telkens met een openingszin die je letterlijk kan gebruiken.</p>
<p>Eén regel geldt voor alle vijf: voer ze onder vier ogen, en nooit op het einde van de dag.</p>

<h2>1 · De medewerker die te traag werkt</h2>
<p><strong>Wanneer:</strong> je merkt het al weken en je hebt het nog niet benoemd.</p>
<div class="blok"><h3>Opening</h3><p>"Ik wil iets met je bespreken dat me al een tijdje opvalt. Het is geen verwijt, ik wil vooral begrijpen hoe jij het ziet."</p></div>
<ul>
<li><strong>Benoem feitelijk.</strong> Geen "je bent traag", wel "de laatste drie dossiers duurden gemiddeld twee weken, we mikken op één".</li>
<li><strong>Zwijg dan.</strong> Laat de stilte vallen. Zijn antwoord bevat meestal de echte oorzaak.</li>
<li><strong>Zoek de oorzaak samen.</strong> Ontbreekt er kennis, tijd, materiaal, of duidelijkheid over prioriteit?</li>
<li><strong>Maak het meetbaar.</strong> Spreek af wat er over vier weken anders is en hoe jullie dat zien.</li>
</ul>
<p><strong>Afsluiting:</strong> "We kijken hier over vier weken opnieuw naar. Wat heb je van mij nodig om daar te geraken?"</p>
<p class="hint">Valkuil: het gesprek verzachten tot het niet meer aankomt. Dan denkt hij dat het meeviel en verandert er niets.</p>

<h2 class="nieuw">2 · De klant met een klacht</h2>
<p><strong>Wanneer:</strong> er is iets misgelopen en jij belt, liefst voor hij een tweede keer moet vragen.</p>
<div class="blok"><h3>Opening</h3><p>"Ik bel zelf omdat ik gehoord heb wat er is misgelopen. Ik wil eerst van jou horen hoe je het ervaren hebt."</p></div>
<ul>
<li><strong>Luister eerst volledig.</strong> Onderbreek niet, ook niet om iets recht te zetten dat feitelijk fout is.</li>
<li><strong>Vat samen.</strong> "Als ik het goed begrijp, is het probleem vooral dat..." Zo weet hij dat je geluisterd hebt.</li>
<li><strong>Erken wat er te erkennen valt.</strong> Ook als de fout niet volledig bij jou ligt: erken de ervaring, niet de schuld.</li>
<li><strong>Stel één concrete stap voor</strong> met een datum, en beloof niets dat je niet zeker kan waarmaken.</li>
</ul>
<p><strong>Afsluiting:</strong> "Ik kom hier zelf op terug voor [datum]. Als je voor die tijd iets hoort dat niet klopt, bel je mij rechtstreeks."</p>
<p class="hint">Valkuil: uitleggen waarom het gebeurd is voor je erkend hebt wat het voor hem betekende. Dan klinkt elke uitleg als een excuus.</p>

<h2 class="nieuw">3 · De prijsverhoging aankondigen</h2>
<p><strong>Wanneer:</strong> bij bestaande klanten, altijd persoonlijk voor de mail vertrekt.</p>
<div class="blok"><h3>Opening</h3><p>"Ik wil je persoonlijk laten weten dat onze tarieven vanaf [datum] aangepast worden, voor je het in een mail leest."</p></div>
<ul>
<li><strong>Wees concreet en kort.</strong> Het nieuwe tarief, de ingangsdatum, en of lopende afspraken nog aan het oude tarief lopen.</li>
<li><strong>Geef één echte reden.</strong> Niet drie. Eén reden die klopt, klinkt eerlijker dan een lijst.</li>
<li><strong>Verontschuldig je niet.</strong> Een verontschuldiging suggereert dat de verhoging onterecht is.</li>
<li><strong>Laat ruimte voor de reactie.</strong> Vraag expliciet: "wat betekent dat voor jullie?"</li>
</ul>
<p><strong>Afsluiting:</strong> "Ik wilde dat je het van mij hoorde. De mail met de details volgt vandaag."</p>
<p class="hint">Valkuil: de verhoging aankondigen én meteen een korting aanbieden. Dan leert de klant dat je prijs onderhandelbaar is.</p>

<h2 class="nieuw">4 · Het slechtnieuwsgesprek</h2>
<p><strong>Wanneer:</strong> een einde contract, een functie die verdwijnt, een samenwerking die stopt.</p>
<div class="blok"><h3>Opening</h3><p>"Ik heb geen goed nieuws, en ik ga er niet omheen draaien. [De beslissing.] Ik leg zo uit hoe ik daartoe gekomen ben."</p></div>
<ul>
<li><strong>Zeg het in de eerste dertig seconden.</strong> Een lange aanloop is wreder dan de boodschap zelf.</li>
<li><strong>Geef de beslissing als beslissing,</strong> niet als een voorstel dat nog bespreekbaar is. Anders wordt het een onderhandeling die je toch niet ingaat.</li>
<li><strong>Leg daarna pas uit,</strong> in twee of drie zinnen. Meer wordt verdediging.</li>
<li><strong>Maak ruimte voor de reactie</strong> en verwacht geen redelijkheid in het eerste kwartier.</li>
<li><strong>Wees concreet over het praktische:</strong> datum, wat er nog loopt, wat jij doet, wat hij moet doen.</li>
</ul>
<p><strong>Afsluiting:</strong> "Ik weet dat dit hard aankomt. Neem de tijd. Morgen zet ik alles op papier zodat je het rustig kan nalezen."</p>
<p class="hint">Valkuil: de beslissing verzachten tot ze onduidelijk wordt. Dan begint er een tweede gesprek waarin je hetzelfde nog eens moet zeggen, maar harder.</p>

<h2 class="nieuw">5 · Het functioneringsgesprek</h2>
<p><strong>Wanneer:</strong> minstens twee keer per jaar, en bij nieuwe mensen na maximaal drie maanden.</p>
<div class="blok"><h3>Opening</h3><p>"Dit gesprek gaat twee kanten op: hoe jij je job ziet, en hoe ik jouw werk zie. We beginnen met jouw kant."</p></div>
<ul>
<li><strong>Laat hem eerst spreken.</strong> Vraag: wat ging goed, wat liep stroef, waar heb je iets nodig?</li>
<li><strong>Geef daarna jouw beeld,</strong> met voorbeelden. Zonder voorbeelden klinkt lof leeg en kritiek willekeurig.</li>
<li><strong>Praat over resultaten,</strong> niet over persoonlijkheid. "Deze drie dossiers liepen uit" is bespreekbaar, "je bent chaotisch" niet.</li>
<li><strong>Eindig met maximaal twee afspraken.</strong> Meer onthoudt niemand.</li>
</ul>
<p><strong>Afsluiting:</strong> "We hebben twee dingen afgesproken. Ik zet ze op papier en we kijken er over drie maanden opnieuw naar."</p>
<p class="hint">Valkuil: het gesprek gebruiken om iets recht te zetten dat je al maanden stoort. Dan is het geen functioneringsgesprek maar een opgespaarde correctie, en zo voelt het ook.</p>`,
  },
]

if (existsSync(TMP)) rmSync(TMP, { recursive: true, force: true })
mkdirSync(TMP, { recursive: true })
mkdirSync(UIT, { recursive: true })

for (const f of FREEBIES) {
  const htmlPad = resolve(TMP, `${f.file}.html`)
  const pdfPad = resolve(UIT, `${f.file}.pdf`)
  writeFileSync(htmlPad, html(f.titel, f.sub, f.body), 'utf8')
  execFileSync(CHROME, [
    '--headless', '--disable-gpu', '--no-sandbox',
    '--no-pdf-header-footer',
    `--print-to-pdf=${pdfPad}`,
    `file:///${htmlPad.replace(/\\/g, '/')}`,
  ], { stdio: 'pipe' })
  console.log(`  ${f.file}.pdf`)
}
rmSync(TMP, { recursive: true, force: true })
console.log(`${FREEBIES.length} PDF's gerenderd naar public/downloads/`)
