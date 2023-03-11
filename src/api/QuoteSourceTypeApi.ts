import axios from 'axios';
import {Pageable, PageableEntity} from 'src/types/common';
import {QuoteSourceType} from 'src/types/domain';

export interface IQuoteSourceTypeApi {
  getAll: () => Promise<Array<QuoteSourceType>>;
  getAllPageable: (pageable: Pageable) => Promise<PageableEntity<QuoteSourceType>>;
  getOne: (id: number) => Promise<QuoteSourceType>;
  create: (quote: QuoteSourceType) => Promise<QuoteSourceType>;
  update: (id: number, quote: QuoteSourceType) => Promise<QuoteSourceType>;
  deleteItem: (id: number) => Promise<undefined>;
}

const url = '/api/quote-source-type';
const instance = axios.create({
  baseURL: url,
  timeout: 10000,
  headers: {'Access-Control-Allow-Origin': '*'}
});

async function getAll(): Promise<Array<QuoteSourceType>> {
  const response = await instance.get('');
  const data = await response.data;
  return <Array<QuoteSourceType>>data;
}

async function getAllPageable(pageable: Pageable): Promise<PageableEntity<QuoteSourceType>> {
  const response = await instance.get('', {params: pageable});
  const data = await response.data;
  return <PageableEntity<QuoteSourceType>>data;
}

async function getOne(id: number): Promise<QuoteSourceType> {
  const response = await instance.get(`${id}`);
  const data = await response.data;
  return <QuoteSourceType>data;
}

async function create(quote: QuoteSourceType): Promise<QuoteSourceType> {
  const response = await instance.put('', quote);
  return await response.data;
}

async function deleteItem(id: number): Promise<undefined> {
  return await instance.delete(`${id}`);
}

async function update(id: number, quote: QuoteSourceType): Promise<QuoteSourceType> {
  const response = await instance.post(`${id}`, quote);
  return await response.data;
}

const api: IQuoteSourceTypeApi = {
  getAll,
  getAllPageable,
  getOne,
  deleteItem,
  update,
  create
};

export default api;
