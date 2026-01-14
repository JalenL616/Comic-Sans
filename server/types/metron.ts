export interface MetronComic {
    series: {
      name: string;
      volume: string;
      year_began: string;
    }
    number: string;
    issue: string;
    image: string;
}

export interface MetronResponse {
  count: number;
  results: MetronComic[];
}