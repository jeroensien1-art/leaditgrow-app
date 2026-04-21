// ============================================================
//  Lead it, Grow — Gmail Auto-Responder (Claude Haiku)
//  Installatie: zie README onderaan dit bestand
// ============================================================

var PROCESSED_LABEL = 'auto-beantwoord';
var URGENT_LABEL    = 'dringend-alert';
var FROM_NAME       = 'Jeroen — Lead it, Grow';
var NOTIFY_EMAIL    = 'sovereign.now333@gmail.com'; // melding bij dringende mail

// ─── Hoofdfunctie — stel trigger in op elke 5 minuten ───────
function checkNewEmails() {
  var apiKey = PropertiesService.getScriptProperties().getProperty('ANTHROPIC_API_KEY');
  if (!apiKey) {
    Logger.log('❌ ANTHROPIC_API_KEY niet ingesteld in Script Properties');
    return;
  }

  var processedLabel = getOrCreateLabel(PROCESSED_LABEL);
  var urgentLabel    = getOrCreateLabel(URGENT_LABEL);

  // Zoek ongelezen mails die nog niet beantwoord zijn
  var threads = GmailApp.search('is:unread -label:' + PROCESSED_LABEL + ' to:sovereign.now333@gmail.com');

  threads.forEach(function(thread) {
    var messages = thread.getMessages();
    var lastMsg  = messages[messages.length - 1];

    // Sla eigen berichten over
    if (lastMsg.getFrom().indexOf('sovereign.now333@gmail.com') !== -1) return;
    if (lastMsg.getFrom().indexOf('leaditgrow.be') !== -1) return;

    var senderName    = lastMsg.getFrom().replace(/<.*>/, '').trim();
    var senderEmail   = lastMsg.getFrom().match(/<(.+)>/) ? lastMsg.getFrom().match(/<(.+)>/)[1] : lastMsg.getFrom();
    var subject       = lastMsg.getSubject();
    var body          = lastMsg.getPlainBody().substring(0, 2000); // max 2000 chars naar Haiku
    var isUrgent      = /dringend|urgent|asap|zo snel mogelijk|spoed/i.test(subject + ' ' + body);

    Logger.log('📧 Nieuwe mail van: ' + senderEmail + ' | Onderwerp: ' + subject);

    // Genereer 3 beschikbare tijdslots
    var slots = getAvailableSlots();

    // Vraag Haiku om een antwoord
    var reply = generateReply(apiKey, senderName, senderEmail, subject, body, slots, isUrgent);

    if (reply) {
      // Verstuur reply
      thread.reply(reply, {
        name: FROM_NAME,
        replyTo: 'jeroen@leaditgrow.be',
      });

      // Label als verwerkt
      thread.addLabel(processedLabel);
      thread.markRead();

      Logger.log('✅ Antwoord verstuurd naar ' + senderEmail);

      // Stuur melding bij dringende mail
      if (isUrgent) {
        thread.addLabel(urgentLabel);
        GmailApp.sendEmail(
          NOTIFY_EMAIL,
          '🚨 DRINGENDE MAIL van ' + senderEmail,
          'Onderwerp: ' + subject + '\n\n' + body.substring(0, 500) + '\n\n---\nAuto-reply al verstuurd.',
          { name: 'Lead it, Grow Alert' }
        );
        Logger.log('🚨 Urgente melding verstuurd');
      }
    }
  });
}

// ─── Genereer antwoord via Claude Haiku ─────────────────────
function generateReply(apiKey, senderName, senderEmail, subject, body, slots, isUrgent) {
  var today    = Utilities.formatDate(new Date(), 'Europe/Brussels', 'EEEE d MMMM yyyy');
  var slotsStr = slots.map(function(s) { return '- ' + s; }).join('\n');

  var systemPrompt = [
    'Je bent de vriendelijke assistent van Jeroen van Lead it, Grow (leaditgrow.be).',
    'Je beantwoordt e-mails namens Jeroen op een warme, professionele manier — niet formeel, niet overdreven zakelijk.',
    '',
    '## Over Lead it, Grow',
    'Lead it, Grow helpt ondernemers van 5-50 medewerkers (€1M+ omzet) die vastzitten in de "oprichtersbottleneck":',
    'alles loopt via hen, ze werken 60-80u/week, groei is fragiel.',
    '',
    '## Core services (offer ladder):',
    '- Gratis: Revenue Calculator (2 min tool op de website)',
    '- Actiehandboek: €97-297 — op maat 30-dagenplan met top 3 fixes',
    '- BD Sprint: €997-2.500 — done-with-you, 4 weken, speed-to-lead automatisering',
    '- Done-for-You Retainer: €1.500-3.500/maand — wij runnen het systeem',
    '- White-Label Licentie: €5.000+ — voor agencies',
    '- Health coaching voor ondernemers (energie, focus, leefstijl)',
    '- Leiderschapsanalyse & balans via partner (gratis intro)',
    '',
    '## Hoe je reageert:',
    '1. Begroet de persoon bij naam (als bekend)',
    '2. Erken hun vraag/situatie kort en empathisch',
    '3. Geef een concreet, nuttig antwoord',
    '4. Stel 1 kwalitatieve vervolgvraag om de situatie beter te begrijpen (lead kwalificeren)',
    '   - Bijv: hoeveel medewerkers, wat is de grootste bottleneck nu, wat hebben ze al geprobeerd',
    '5. Bied een gratis kennismakingsgesprek aan en noem de 3 beschikbare tijdslots',
    '6. Sluit warm af namens Jeroen',
    '',
    'Schrijf altijd in het taal van de e-mail (NL of EN). Gebruik geen em dashes (--). Houd het menselijk en kort — max 150 woorden.',
    isUrgent ? 'BELANGRIJK: deze mail is als dringend gemarkeerd. Erken dit expliciet en zeg dat Jeroen persoonlijk zo snel mogelijk contact opneemt.' : '',
    '',
    'Vandaag is het: ' + today,
    '',
    '## Beschikbare tijdslots voor een kennismakingsgesprek (30 min, online):',
    slotsStr,
  ].join('\n');

  var userPrompt = [
    'Beantwoord deze e-mail namens Jeroen:',
    '',
    'Van: ' + senderName + ' <' + senderEmail + '>',
    'Onderwerp: ' + subject,
    '',
    body,
  ].join('\n');

  var payload = {
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 400,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  };

  var options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };

  try {
    var response = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', options);
    var json     = JSON.parse(response.getContentText());

    if (json.content && json.content[0] && json.content[0].text) {
      return json.content[0].text;
    } else {
      Logger.log('❌ Haiku API fout: ' + response.getContentText());
      return null;
    }
  } catch (e) {
    Logger.log('❌ Fetch fout: ' + e.toString());
    return null;
  }
}

// ─── Genereer 3 tijdslots op komende werkdagen (10u-16u) ────
function getAvailableSlots() {
  var slots    = [];
  var now      = new Date();
  var times    = ['10:00', '11:30', '14:00', '15:30'];
  var dayCount = 0;
  var checked  = 0;

  while (slots.length < 3 && checked < 14) {
    checked++;
    var d = new Date(now);
    d.setDate(now.getDate() + dayCount + 1);
    dayCount++;

    var dow = d.getDay();
    if (dow === 0 || dow === 6) continue; // skip weekend

    var dateStr = Utilities.formatDate(d, 'Europe/Brussels', 'EEEE d MMMM');
    // Kies een vast tijdstip per dag (roterend)
    var time = times[slots.length % times.length];
    slots.push(dateStr + ' om ' + time);
  }

  return slots;
}

// ─── Helper: label ophalen of aanmaken ──────────────────────
function getOrCreateLabel(name) {
  var label = GmailApp.getUserLabelByName(name);
  if (!label) label = GmailApp.createLabel(name);
  return label;
}

// ─── Eenmalige setup: trigger aanmaken ──────────────────────
function setupTrigger() {
  // Verwijder bestaande triggers
  ScriptApp.getProjectTriggers().forEach(function(t) {
    if (t.getHandlerFunction() === 'checkNewEmails') {
      ScriptApp.deleteTrigger(t);
    }
  });

  // Maak nieuwe trigger: elke 5 minuten
  ScriptApp.newTrigger('checkNewEmails')
    .timeBased()
    .everyMinutes(5)
    .create();

  Logger.log('✅ Trigger aangemaakt: checkNewEmails elke 5 minuten');
}

/*
=============================================================
  INSTALLATIE-INSTRUCTIES
=============================================================

1. Ga naar: https://script.google.com
   Log in met: sovereign.now333@gmail.com

2. Klik op "Nieuw project"
   Noem het: "Lead it, Grow Autoresponder"

3. Verwijder alle bestaande code en plak DIT hele bestand erin

4. Sla op (Ctrl+S)

5. Voeg je API key toe:
   - Klik op het tandwiel (Project Settings) links
   - Scroll naar "Script Properties"
   - Klik "Add script property"
   - Naam: ANTHROPIC_API_KEY
   - Waarde: [jouw Anthropic API key — zie .env.local]
   - Klik "Save script properties"

6. Selecteer bovenaan de functie "setupTrigger" en klik op Uitvoeren (▶)
   - Accepteer de gevraagde toestemmingen (Gmail lezen + versturen)

7. Klaar! De autoresponder draait nu elke 5 minuten.

TESTEN:
- Selecteer "checkNewEmails" en klik ▶ om handmatig te testen
- Stuur een testmail naar jeroen@leaditgrow.be
- Bekijk de logs via Weergave > Logs

LABELS:
- Beantwoorde mails krijgen label: "auto-beantwoord"
- Dringende mails krijgen label: "dringend-alert" + jij krijgt een notificatie
=============================================================
*/
