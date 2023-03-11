import {QNotifyCreateOptions} from 'quasar';

export type Pageable = {
  size: number;
  page: number;
}

export type PageableEntity<E> = {
  content: Array<E>,
  totalPages: number,
  numberOfElements: number,
  number: number,
  totalElements: number
}

export interface RestApi<E> {
  getAll?: () => Promise<Array<E>>,
  getAllPageable?: (pageable: Pageable) => Promise<PageableEntity<E>>;
  getOne?: (id: number) => Promise<E>;
  save?: (entity: E) => Promise<E>;
  update?: (id: number, entity: E) => Promise<E>;
  delete?: (id: number) => Promise<void | undefined | unknown>;
}


export function genNotifyOpts(msg: string, color: string): QNotifyCreateOptions {
  return {
    progress: true,
    message: msg,
    color: color,
    timeout: 1000,
    actions: [{
      label: 'Dismiss', color: 'white', handler: () => { /* ... */}
    }]
  }
}
