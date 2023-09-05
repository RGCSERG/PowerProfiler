import {
  loginFormData,
  tokenData,
  signUpFormData,
  user,
  errorResponse,
  plan,
  updatedUser,
} from "./interfaces";
import axios, { AxiosError, CanceledError } from "axios";
import { getToken, setToken } from "./UserManagement";
import { cookies } from "./cookiemanagement";
import { handleApiError } from "./errors";

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
      return handleApiError(err);
    });

  return request; // Return the promise directly, not the abort function
};

export const refreshAccessToken = async (refresh_token: string) => {
  const controller = new AbortController();

  try {
    const response = await axios.post<tokenData>(
      "http://localhost:8000/refresh",
      {},
      {
        signal: controller.signal,
        headers: { Authorization: "Bearer " + refresh_token },
      }
    );

    setToken(response.data.access_token);
    return response; // Return the response
  } catch (err) {
    if (err instanceof CanceledError) return;
    return handleApiError(err);
  }
};

export const createUser = async (user: signUpFormData) => {
  const controller = new AbortController();

  const request = await axios
    .post<user>("http://localhost:8000/users", user, {
      signal: controller.signal,
    })
    .then((res) => {
      return null;
    })
    .catch((err) => {
      if (err instanceof CanceledError) return;
      return handleApiError(err);
    });

  return request; // Return the promise directly, not the abort function
};

export const getUserPlans = async (
  setPlans: React.Dispatch<React.SetStateAction<plan[]>>
) => {
  try {
    const token = getToken();

    const resp = await axios.get<plan[]>("http://localhost:8000/users/plans", {
      headers: { Authorization: "Bearer " + token },
    });

    setPlans(resp.data);
  } catch (err) {
    return await handleApiError(err);
  }
};

export const getUserData = async (
  setUserData: React.Dispatch<React.SetStateAction<user>>
) => {
  try {
    const token = getToken();

    const resp = await axios.get<user>("http://localhost:8000/users/@me/", {
      headers: { Authorization: "Bearer " + token },
    });

    setUserData(resp.data);
  } catch (err) {
    return await handleApiError(err);
  }
};

export const updateUser = async (
  newUser: updatedUser,
  userData: user,
  setUserData: React.Dispatch<React.SetStateAction<user>>,
  signOut: () => void
) => {
  const oldData = userData;
  try {
    // Update local state optimistically
    const updatedUserData: user = {
      ...userData,
      ...(newUser.email !== undefined && { email: newUser.email }),
      ...(newUser.forename !== undefined && { forename: newUser.forename }),
      ...(newUser.surname !== undefined && { surname: newUser.surname }),
      ...(newUser.disabled !== undefined && { disabled: newUser.disabled }),
      id: 0.1,
    };

    setUserData(updatedUserData);

    // Prepare for API request
    const controller = new AbortController();
    const token = getToken();

    // Perform API request
    const response = await axios.put<user>(
      "http://localhost:8000/users/@me/",

      updatedUserData,

      {
        signal: controller.signal,
        headers: { Authorization: "Bearer " + token },
      }
    );

    // Update local state with response data
    if (newUser.email !== undefined) {
      signOut();
      return;
    }
    setUserData(response.data);
  } catch (err: unknown) {
    setUserData(oldData);
    return await handleApiError(err);
  }
};
