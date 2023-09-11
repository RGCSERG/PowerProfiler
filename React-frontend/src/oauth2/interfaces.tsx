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

export interface Appliance {
  id: number;
  data: string;
  name: string;
  date_created: string;
}

export interface SubClass {
  id: number;
  name: string;
  plan_id: number;
  appliances?: Appliance[];
  date_created: string;
}

export interface PlanType {
  id: number;
  data: string;
  date_created: string;
}

export interface TotalPlanData {
  id: number;
  type: PlanType;
  date_created: string;
  owner_id: number;
  users: number;
  total_cost: number;
  SubClasses?: SubClass[];
}
