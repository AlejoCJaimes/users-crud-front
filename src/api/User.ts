export interface User {
  username?: string;
  fullname?: string;
  email?: string;
  password_hash?: string;
  is_authenticated?: boolean;
  is_superuser?: boolean;
  is_blocked?: boolean;
  id?: number;
}
