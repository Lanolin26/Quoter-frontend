import {Pageable, PageableEntity, RestApi} from './common';
import axios, {AxiosInstance} from 'axios';

export class CommonRestApi<E> implements RestApi<E> {
  private instance: AxiosInstance;

  public constructor(baseUrl: string) {
    this.instance = axios.create({
      baseURL: baseUrl,
      timeout: 10000,
      headers: {'Access-Control-Allow-Origin': '*'}
    });
  }

  public async getAll(): Promise<Array<E>> {
    const response = await this.instance.get('');
    const data = await response.data;
    return <Array<E>>data;
  }

  public async getAllPageable(pageable: Pageable): Promise<PageableEntity<E>> {
    const response = pageable ? await this.instance.get('', {params: pageable}) : await this.instance.get('');
    const data = await response.data;
    return <PageableEntity<E>>data;
  }

  public async getOne(id: number): Promise<E> {
    const response = await this.instance.get(`${id}`);
    const data = await response.data;
    return <E>data;
  }

  public async save(entity: E): Promise<E> {
    const response = await this.instance.put('', entity);
    const data = await response.data;
    return <E>data;
  }

  public async update(id: number, entity: E): Promise<E> {
    const response = await this.instance.post(`${id}`, entity);
    const data = await response.data;
    return <E>data;
  }

  public async delete(id: number): Promise<unknown> {
    return await this.instance.delete(`${id}`);
  }
}
