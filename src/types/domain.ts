export interface QuoteIdsInfo {
  id: number;
  text: string;
  sourceId: number;
  sourceTypeId: number;
  authorId: number;
}

export interface QuoteInfo {
  id: number;
  text: string;
  sourceName: string;
  sourceType: string;
  authorName: string;
  authorLogin: string;
}

export interface QuoteSource {
  id: number;
  sourceName: string;
  type: QuoteSourceType;
}

export interface QuoteSourceType {
  id: number;
  type: string;
}

export interface QuoteUser {
  id: number;
  login: string;
  name: string;
  password?: string;
  img?: string;
  roles: Array<UserRoles>;
}

export enum UserRoles {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  GUEST = 'GUEST'
}
