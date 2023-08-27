import { loginFormData, tokenData, signUpFormData, user } from "./interfaces";
import axios, { CanceledError } from "axios";
import { setToken } from "./UserManagement";
import { cookies } from "./Cookies";

const options = {
  secure: true,
  expires: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
};

export const getAccessToken = (user: loginFormData) => {
  const controller = new AbortController();

  const request = axios
    .post<tokenData>("http://localhost:8000/login", user, {
      signal: controller.signal,
    })
    .then((res) => {
      cookies.set("refresh_token", res.data.refresh_token, options);
      setToken(res.data.access_token);
    })
    .catch((err) => {
      if (err instanceof CanceledError) return;
    });

  return request; // Return the promise directly, not the abort function
};

export const refreshAccessToken = async (refresh_token: string) => {
  const controller = new AbortController();

  try {
    const response = await axios.post<tokenData>(
      "http://localhost:8000/users/refresh",
      {},
      {
        signal: controller.signal,
        headers: { Authorization: "Bearer " + refresh_token },
      }
    );

    setToken(response.data.access_token);
    return response; // Return the response
  } catch (err) {
    if (!(err instanceof CanceledError)) {
      console.error(err);
    }
    throw err; // Rethrow the error to let the caller handle it
  }
};

export const createUser = async (user: signUpFormData) => {
  const controller = new AbortController();

  const request = await axios
    .post<user>("http://localhost:8000/users", user, {
      signal: controller.signal,
    })
    .then((res) => {})
    .catch((err) => {
      if (err instanceof CanceledError) return;
    });

  return request; // Return the promise directly, not the abort function
};
