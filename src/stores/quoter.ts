import { defineStore } from 'pinia';
import {QuoteIdsInfo, QuoteInfo} from 'src/types/domain';

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
