import { defineStore } from 'pinia';
import {i18n} from 'boot/i18n';

interface State {
  title: string;
  locale: string;
}

export const usePageStore = defineStore('pages', {
  state: (): State => ({
    title: 'Main',
    locale: i18n.global.locale,
  }),

  getters: {
    getTitle(state) {
      return state.title;
    },
    currentLocale(state) {
      return state.locale;
    }
  },

  actions: {
    setTitle(newTitle: string) {
      this.title = newTitle;
      document.title = `${newTitle}`
    },
    setLocale(newLocale: string) {
      this.locale = newLocale;
      i18n.global.locale = newLocale;
    }
  }
});
