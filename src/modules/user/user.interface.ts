import type { AccountType } from '../../interfaces/global.interface';

export interface RegisterInputProps {
  fullname: string;
  username: string;
  email: string;
  password: string;
  role?: AccountType | null;
  phoneNumber: string;
}

export interface CreateUserProps {
  fullname: string;
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
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
