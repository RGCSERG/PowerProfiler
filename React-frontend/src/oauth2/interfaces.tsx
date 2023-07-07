export interface TokenFormData {
  email: string;
  password: string;
}

export interface TokenData {
  access_token: string;
  token_type: string;
}

export interface User {
  id: number;
  email: string;
  password: string;
  forename: string;
  surname: string;
  disabled: boolean;
}
