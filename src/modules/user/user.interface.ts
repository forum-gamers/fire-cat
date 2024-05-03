import type { AccountType } from '../../interfaces/global.interface';

export interface RegisterInputProps {
  fullname: string;
  username: string;
  email: string;
  password: string;
  role?: AccountType;
}

export interface CreateUserProps {
  fullname: string;
  username: string;
  email: string;
  password: string;
}
