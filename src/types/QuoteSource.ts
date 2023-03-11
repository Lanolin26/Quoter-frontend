import QuoteSourceType from 'src/types/QuoteSourceType';

export default interface QuoteSource {
  id: number;
  sourceName: string;
  type: QuoteSourceType;
}
