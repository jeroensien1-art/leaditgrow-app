// Gedeeld rekenmodel voor het omzetlek. Gebruikt door /calculator en de diagnose-rapporten.

// Niet elke lead wordt klant, ook niet met perfecte opvolging. Zonder deze factor
// rekent het model het volledige leadvolume maal de opdrachtwaarde als haalbare
// omzet, wat bedragen oplevert die geen ondernemer gelooft.
export const CONVERSION_RATE = 0.25

export const leadsMap: Record<string, number> = {
  'Fewer than 5': 3,      'Minder dan 5': 3,
  '5 to 20': 12,          '5 tot 20': 12,
  '20 to 50': 35,         '20 tot 50': 35,
  'More than 50': 65,     'Meer dan 50': 65,
}

export const dealMap: Record<string, number> = {
  'Under €1,000': 600,          'Onder €1.000': 600,
  '€1,000 to €5,000': 2500,    '€1.000 tot €5.000': 2500,
  '€5,000 to €20,000': 10000,  '€5.000 tot €20.000': 10000,
  'Over €20,000': 25000,        'Boven €20.000': 25000,
}
