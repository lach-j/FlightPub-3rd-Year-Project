export interface User {
  id?: number;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role?: UserRole;
}

export enum UserRole {
  STANDARD_USER = 'STANDARD_USER',
  TRAVEL_AGENT = 'TRAVEL_AGENT',
  ADMINISTRATOR = 'ADMINISTRATOR'
}
