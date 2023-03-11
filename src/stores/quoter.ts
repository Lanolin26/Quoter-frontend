import { defineStore } from 'pinia';
import QuoteIdsInfo from 'src/types/QuoteIdsInfo';
import QuoteInfo from 'src/types/QuoteInfo';

interface State {
  quotes: QuoteInfo[];
  quotesId: QuoteIdsInfo[];
}
export const useQuoteStore = defineStore('quote', {
  state: (): State => ({
    quotes: [],
    quotesId: [],
  }),

  getters: {

  },

  actions: {

  }
});
