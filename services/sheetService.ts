import { Place } from '../types';

// ===================================================================================
// IMPORTANTE: Cole aqui o link da sua planilha publicada como TSV (Valores Separados por Tabulação)
// Siga os passos: Arquivo > Compartilhar > Publicar na web > Selecione a aba e formato TSV > Publicar
// ===================================================================================
const GOOGLE_SHEET_TSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSpdxaFzuIB1AgaMdA26nLenJgezEMRMtEAGuXT1dGb0vFa-zbZCjWHT0KerR1RmkBl5XBZ0PBV6NyJ/pub?gid=1576459715&single=true&output=tsv';

const getCoordsFromUrl = (url: string): { lat: number, lng: number } => {
    if (!url) return { lat: -23.5505, lng: -46.6333 }; // Default SP coords
    const match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match && match[1] && match[2]) {
        return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
    }
    return { lat: -23.5505, lng: -46.6333 };
};

const parseBoolean = (value: string): boolean => {
    const upperValue = (value || '').trim().toUpperCase();
    return upperValue === 'TRUE' || upperValue === 'SIM';
};

const parseDate = (dateString: string): string => { // "DD/MM/YYYY"
    if (!dateString) return new Date().toISOString();
    const [day, month, year] = dateString.split('/');
    if (!day || !month || !year) return new Date().toISOString();
    return new Date(Date.UTC(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10))).toISOString();
};


export const fetchAndParseSheetData = async (): Promise<Place[]> => {
    // Add a cache-busting parameter to prevent the browser from loading a stale version of the sheet.
    const url = new URL(GOOGLE_SHEET_TSV_URL);
    url.searchParams.append('cache_bust', new Date().getTime().toString());

    const response = await fetch(url.toString());
    if (!response.ok) {
        throw new Error('Failed to fetch data from Google Sheet');
    }
    const tsvText = await response.text();
    
    // Split by newline, then skip the header row
    const rows = tsvText.split(/\r?\n/).slice(1);

    const places: Place[] = rows
      .map((rowStr, index) => {
          if (!rowStr.trim()) return null; // Skip empty lines

          // Split by tab character for TSV format
          const parts = rowStr.split('\t');
          
          const mapsUrl = parts[3]?.trim() || '';

          const place: Place = {
              id: `${index + 1}-${parts[0]?.trim()}`,
              name: parts[0]?.trim() || '',
              instagramUrl: parts[1]?.trim() || '',
              neighborhood: parts[2]?.trim() || '',
              mapsUrl: mapsUrl,
              coords: getCoordsFromUrl(mapsUrl),
              tags: {
                  club:          parseBoolean(parts[4]),
                  boteco:        parseBoolean(parts[5]),
                  goodFood:      parseBoolean(parts[6]),
                  date:          parseBoolean(parts[7]),
                  dancing:       parseBoolean(parts[8]),
                  birthday:      parseBoolean(parts[9]),
                  beer600:       parseBoolean(parts[10]),
                  gayFriendly:   parseBoolean(parts[11]),
              },
              // After 8 tag columns, date is the next one.
              inclusionDate: parseDate(parts[12]?.trim()),
          };

          return place;
      })
      // Filter out any nulls from skipped rows or rows that don't have a name
      .filter((p): p is Place => p !== null && !!p.name);

    return places;
};