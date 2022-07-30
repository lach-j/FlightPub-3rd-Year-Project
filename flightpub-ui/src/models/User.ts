export interface User {
  id?: number;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role?: UserRole;
}

enum UserRole {
  STANDARD_USER = 0,
  TRAVEL_AGENT = 1,
  ADMINISTRATOR = 2
}
