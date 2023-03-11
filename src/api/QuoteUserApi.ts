import axios from 'axios';
import {Pageable, PageableEntity} from 'src/types/common';
import {QuoteUser} from 'src/types/domain';

export interface IQuoteUserApi {
  getAll: () => Promise<Array<QuoteUser>>;
  getAllPageable: (pageable: Pageable) => Promise<PageableEntity<QuoteUser>>;
  getOne: (id: number) => Promise<QuoteUser>;
  create: (quote: QuoteUser) => Promise<QuoteUser>;
  update: (id: number, quote: QuoteUser) => Promise<QuoteUser>;
  deleteItem: (id: number) => Promise<undefined>;
}

const url = '/api/user';
const instance = axios.create({
  baseURL: url,
  timeout: 10000,
  headers: {'Access-Control-Allow-Origin': '*'}
});

async function getAll(): Promise<Array<QuoteUser>> {
  const response = await instance.get('');
  const data = await response.data;
  return <Array<QuoteUser>>data;
}

async function getAllPageable(pageable: Pageable): Promise<PageableEntity<QuoteUser>> {
  const response = await instance.get('', {params: pageable});
  const data = await response.data;
  return <PageableEntity<QuoteUser>>data;
}

async function getOne(id: number): Promise<QuoteUser> {
  const response = await instance.get(`${id}`);
  const data = await response.data;
  return <QuoteUser>data;
}

async function create(quote: QuoteUser): Promise<QuoteUser> {
  const response = await instance.put('', quote);
  return await response.data;
}

async function deleteItem(id: number): Promise<undefined> {
  return await instance.delete(`${id}`);
}

async function update(id: number, quote: QuoteUser): Promise<QuoteUser> {
  const response = await instance.post(`${id}`, quote);
  return await response.data;
}

const api: IQuoteUserApi = {
  create,
  deleteItem,
  getAll,
  getAllPageable,
  getOne,
  update
};

export default api;
