import axios from 'axios';
import QuoteInfo from 'src/types/QuoteInfo';
import {Pageable, PageableEntity} from 'src/types/common';
import QuoteIdsInfo from 'src/types/QuoteIdsInfo';

export interface IQuoteInfoApi {
  getAll: () => Promise<Array<QuoteInfo>>;
  getAllPageable: (pageable: Pageable) => Promise<PageableEntity<QuoteInfo>>;
  getOne: (id: number) => Promise<QuoteInfo>;

  getIdsAll: () => Promise<Array<QuoteIdsInfo>>;
  getIdsAllPageable: (pageable: Pageable) => Promise<PageableEntity<QuoteIdsInfo>>;
  getIdsOne: (id: number) => Promise<QuoteIdsInfo>;
  create: (quote: QuoteIdsInfo) => Promise<QuoteIdsInfo>;
  update: (id: number, quote: QuoteIdsInfo) => Promise<QuoteIdsInfo>;
  deleteItem: (id: number) => Promise<undefined>;
}

const url = '/api/quote/v2';
const instance = axios.create({
  baseURL: url,
  timeout: 10000,
  headers: {'Access-Control-Allow-Origin': '*'}
});

async function getAll(): Promise<Array<QuoteInfo>> {
  const response = await instance.get('');
  return await response.data;
}

async function getAllPageable(pageable: Pageable): Promise<PageableEntity<QuoteInfo>> {
  const response = await instance.get('', {params: pageable});
  return await response.data;
}

async function getOne(id: number): Promise<QuoteInfo> {
  const response = await instance.get(`${id}`);
  const data = await response.data;
  return <QuoteInfo>data;
}

async function getIdsAll(): Promise<Array<QuoteIdsInfo>> {
  const response = await instance.get('with_id/');
  return await response.data;
}

async function getIdsAllPageable(pageable: Pageable): Promise<PageableEntity<QuoteIdsInfo>> {
  const response = await instance.get('with_id/', {params: pageable});
  return await response.data;
}

async function getIdsOne(id: number): Promise<QuoteIdsInfo> {
  const response = await instance.get(`with_id/${id}`);
  return await response.data;
}

async function create(quote: QuoteIdsInfo): Promise<QuoteIdsInfo> {
  const response = await instance.put('', quote);
  return await response.data;
}
async function deleteItem(id: number): Promise<undefined> {
  return await instance.delete(`${id}`);
}
async function update(id: number, quote: QuoteIdsInfo): Promise<QuoteIdsInfo> {
  const response = await instance.post(`${id}`, quote);
  return await response.data;
}

const api: IQuoteInfoApi = {
  getAll,
  getAllPageable,
  getOne,
  getIdsAll,
  getIdsAllPageable,
  getIdsOne,
  create,
  deleteItem,
  update,
}

export default api;
