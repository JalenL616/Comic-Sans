import { MetronComic, MetronResponse } from '../types/metron.js'
import { mapMetronToComic } from './comicMapper.js'
import { Comic } from '../types/comic.js';

export async function searchComicByUPC(upc: string): Promise<Comic | null> {
    const username = process.env.METRON_USERNAME;
    const password = process.env.METRON_PASSWORD;

    if (!username || !password) {
        throw new Error('Metron API credentials not configured');
    }

    // Authorization credentials header
    const credentials = Buffer.from(`${username}:${password}`).toString('base64');

    const response = await fetch (
      `https://metron.cloud/api/issue/?upc=${upc}`,
      {
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Accept': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Metron API error: ${response.status}`)
    }

    const data: MetronResponse = await response.json();
    const metronComic: MetronComic = data.results?.[0];
    
    if (!metronComic) return null;

    // Return mapped metron comic
    return mapMetronToComic(metronComic, upc);
}