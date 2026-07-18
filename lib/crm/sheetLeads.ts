import { google } from 'googleapis'

// Apify Leads sheet — zelfde sheet als leaditgrow-setup/outbound_runner.py gebruikt.
// Alleen gebruikt als fallback wanneer een reply niet bij een Supabase-lead hoort
// (d.w.z. de reply komt van de sheet-gebaseerde cold-outreach, niet het contactformulier).
const SHEET_ID = '1Lh3Cnu9LVQcRZ0eGZaexIkPgNlMXX8dV_B_8mzKCvik'
const SHEET_TAB = 'Leads'

// Kolomindices — moeten in sync blijven met leaditgrow-setup/outbound_runner.py COL{}
const COL = {
  email: 6,
  lg_status: 47,
  lg_response: 51,
  lg_replies: 57,
}

function colLetter(n: number): string {
  let r = ''
  while (n >= 0) {
    r = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[n % 26] + r
    n = Math.floor(n / 26) - 1
  }
  return r
}

async function getSheetsClient() {
  const tokenJson = process.env.SHEETS_TOKEN_JSON
  if (!tokenJson) throw new Error('SHEETS_TOKEN_JSON not set')
  const creds = JSON.parse(tokenJson) as {
    client_id: string; client_secret: string; refresh_token: string; token_uri: string
  }
  const auth = new google.auth.OAuth2(creds.client_id, creds.client_secret)
  auth.setCredentials({ refresh_token: creds.refresh_token })
  return google.sheets({ version: 'v4', auth })
}

export interface SheetLeadMatch {
  rowIndex: number // 0-based binnen de data (rij 2 in sheet = rowIndex 0)
}

export async function findSheetLeadByEmail(email: string): Promise<SheetLeadMatch | null> {
  const sheets = await getSheetsClient()
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_TAB}!G2:G`, // email-kolom
  })
  const rows = res.data.values ?? []
  const idx = rows.findIndex(r => (r[0] ?? '').trim().toLowerCase() === email.trim().toLowerCase())
  return idx === -1 ? null : { rowIndex: idx }
}

async function updateCell(rowIndex: number, colIndex: number, value: string) {
  const sheets = await getSheetsClient()
  const cell = `${colLetter(colIndex)}${rowIndex + 2}`
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_TAB}!${cell}`,
    valueInputOption: 'RAW',
    requestBody: { values: [[value]] },
  })
}

export async function updateSheetLeadIntent(
  rowIndex: number,
  intent: string,
  replyText: string
): Promise<void> {
  const stamp = new Date().toISOString().slice(0, 16).replace('T', ' ')
  await updateCell(rowIndex, COL.lg_response, intent)
  await updateCell(rowIndex, COL.lg_replies, `[${stamp}] ${intent}: ${replyText.slice(0, 200)}`)
  if (intent === 'NEE' || intent === 'JA_INTERESSE' || intent === 'VRAAG') {
    await updateCell(rowIndex, COL.lg_status, 'gestopt - reply ontvangen')
  }
}
