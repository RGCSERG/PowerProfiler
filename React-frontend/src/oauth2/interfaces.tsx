export interface loginFormData {
  email: string;
  password: string;
}

export interface tokenData {
  access_token: string;
  refresh_token?: string;
}

export interface user {
  id: number;
  email: string;
  forename: string;
  surname: string;
  disabled: boolean;
  date_created: string;
}

export interface plan {
  id: number;
  owner_id: number;
  type: number;
  total_cost: number;
  users: number;
  date_created: string;
}

export interface errorResponse {
  detail: string;
}

export interface updatedUser {
  email?: string;
  forename?: string;
  surname?: string;
  disabled?: boolean;
}

export interface signUpFormData {
  forename: string;
  surname: string;
  email: string;
  password: string;
}

export interface newPlan {
  type: number;
}
