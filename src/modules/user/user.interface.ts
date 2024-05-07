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

export interface LoginInputProps {
  email: string;
  password: string;
  as?: AccountType;
}

export interface Message {
  message: string;
}

export interface ChangeProfileInput {
  url: string;
  fileId: string;
}
