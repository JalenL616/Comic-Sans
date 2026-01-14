import { MetronComic } from '../types/metron.js'
import { Comic } from '../types/comic.js'

export function mapMetronToComic(metronComic: MetronComic, upc: string): Comic {
    return {
      upc: upc, 
      name: metronComic.issue,
      issueNumber: metronComic.number,
      seriesName: metronComic.series.name,
      seriesVolume: metronComic.series.volume,
      seriesYear: metronComic.series.year_began,
      coverImage: metronComic.image,
      // Variant number in standard format is the 16th digit
      variantNumber: upc[15],
      // Variant number in standard format is the 17th digit
      printing: upc[16]
    };
}
