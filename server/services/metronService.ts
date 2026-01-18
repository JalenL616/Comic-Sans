import { MetronComic, MetronResponse } from '../types/metron.js'
import { mapMetronToComic } from './comicMapper.js'
import { Comic } from '../types/comic.js';

const METRON_TIMEOUT_MS = 8000; // 8 seconds

export async function searchComicByUPC(upc: string): Promise<Comic | null> {
    const username = process.env.METRON_USERNAME;
    const password = process.env.METRON_PASSWORD;

    if (!username || !password) {
        throw new Error('Metron API credentials not configured');
    }

    // Authorization credentials header
    const credentials = Buffer.from(`${username}:${password}`).toString('base64');

    // Add timeout to prevent long waits
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), METRON_TIMEOUT_MS);

    try {
      const response = await fetch (
        `https://metron.cloud/api/issue/?upc=${upc}`,
        {
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Accept': 'application/json'
          },
          signal: controller.signal,
        }
      )

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Metron API error: ${response.status}`)
      }

      const data: MetronResponse = await response.json();
      const metronComic: MetronComic = data.results?.[0];

      if (!metronComic) return null;

      // Return mapped metron comic
      return mapMetronToComic(metronComic, upc);
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Comic lookup timed out');
      }
      throw error;
    }
}