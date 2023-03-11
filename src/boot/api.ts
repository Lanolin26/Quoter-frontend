import {boot} from 'quasar/wrappers';
import QuoterInfoApi, {IQuoteInfoApi} from 'src/api/QuoterInfoApi';
import QuoteSourceApi, {IQuoteSourceApi} from 'src/api/QuoteSourceApi';
import QuoteSourceTypeApi, {IQuoteSourceTypeApi} from 'src/api/QuoteSourceTypeApi';
import QuoteUserApi, {IQuoteUserApi} from 'src/api/QuoteUserApi';

interface IQuoteApi {
  quoteInfo: IQuoteInfoApi;
  quoteSource: IQuoteSourceApi;
  quoteSourceType: IQuoteSourceTypeApi;
  quoteUser: IQuoteUserApi;
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $api: IQuoteApi;
  }
}

const api: IQuoteApi = {
  quoteSource: QuoteSourceApi,
  quoteSourceType: QuoteSourceTypeApi,
  quoteUser: QuoteUserApi,
  quoteInfo: QuoterInfoApi,
}

export default boot(({app}) => {
  app.config.globalProperties.$api = api;
});

export {api};
