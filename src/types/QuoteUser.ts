export default interface QuoteUser {
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
