import axios from 'axios';
import {Pageable, PageableEntity} from 'src/types/common';
import {QuoteSource} from 'src/types/domain';

export interface IQuoteSourceApi {
  getAll: () => Promise<Array<QuoteSource>>;
  getAllPageable: (pageable: Pageable) => Promise<PageableEntity<QuoteSource>>;
  getOne: (id: number) => Promise<QuoteSource>;
  create: (quote: QuoteSource) => Promise<QuoteSource>;
  update: (id: number, quote: QuoteSource) => Promise<QuoteSource>;
  deleteItem: (id: number) => Promise<undefined>;
}

const url = '/api/quote-source';
const instance = axios.create({
  baseURL: url,
  timeout: 10000,
  headers: {'Access-Control-Allow-Origin': '*'}
});

async function getAll(): Promise<Array<QuoteSource>> {
  const response = await instance.get('');
  const data = await response.data;
  return <Array<QuoteSource>>data;
}

async function getAllPageable(pageable: Pageable): Promise<PageableEntity<QuoteSource>> {
  const response = await instance.get('', {params: pageable});
  const data = await response.data;
  return <PageableEntity<QuoteSource>>data;
}

async function getOne(id: number): Promise<QuoteSource> {
  const response = await instance.get(`${id}`);
  const data = await response.data;
  return <QuoteSource>data;
}

async function create(quote: QuoteSource): Promise<QuoteSource> {
  const response = await instance.put('', quote);
  return await response.data;
}

async function deleteItem(id: number): Promise<undefined> {
  return await instance.delete(`${id}`);
}

async function update(id: number, quote: QuoteSource): Promise<QuoteSource> {
  const response = await instance.post(`${id}`, quote);
  return await response.data;
}

const api: IQuoteSourceApi = {
  getAll,
  getAllPageable,
  getOne,
  deleteItem,
  update,
  create
};

export default api;
