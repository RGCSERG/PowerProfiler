import { TotalPlanData, user } from "./interfaces";

export const BASE_USER_MODEL: user = {
  id: 0.1,
  forename: "",
  surname: "",
  email: "",
  disabled: false,
  date_created: "",
};

export const API_URL = "http://localhost:8000/";
export const LOGIN_ENDPOINT = "oauth/login/";
export const REFRESH_ENDPOINT = "oauth/refresh";
export const PLAN_ENDPOINT = "plans/@me/";
export const USER_ENDPOINT = "users/@me/";
export const NEW_USER_ENDPOINT = "users";

export const BASE_TOTAL_PLAN_DATA_MODEL: TotalPlanData = {
  id: 0.1,
  type: {
    id: 0.1,
    data: "default",
    date_created: "Now",
  },
  date_created: "Now",
  owner_id: 0.1,
  users: 0.1,
  total_cost: 0.1,
  SubClasses: undefined,
};
