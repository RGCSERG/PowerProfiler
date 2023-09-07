import {
  loginFormData,
  tokenData,
  signUpFormData,
  user,
  plan,
  updatedUser,
  newPlan,
} from "./interfaces";
import axios, { CanceledError } from "axios";
import { getToken, setToken } from "./UserManagement";
import { cookies } from "./cookiemanagement";
import { handleApiError } from "./errors";
import { APIUrl } from "./constants";

const options = {
  secure: true,
  expires: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
};

export const getAccessToken = (user: loginFormData) => {
  const controller = new AbortController();

  const request = axios
    .post<tokenData>(APIUrl + "login", user, {
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
      APIUrl + "refresh",
      {},
      {
        signal: controller.signal,
        headers: { Authorization: "Bearer " + refresh_token },
      }
    );

    setToken(response.data.access_token); // Make sure this sets the token correctly
    return null;
  } catch (err) {
    if (err instanceof CanceledError) return;
    return await handleApiError(err, true);
  }
};

export const createUser = async (user: signUpFormData) => {
  const controller = new AbortController();

  const request = await axios
    .post<user>(APIUrl + "users", user, {
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

    const resp = await axios.get<plan[]>(APIUrl + "plans/@me", {
      headers: { Authorization: "Bearer " + token },
    });

    setPlans(resp.data);
    return;
  } catch (err) {
    return await handleApiError(err);
  }
};

export const getUserData = async (
  setUserData: React.Dispatch<React.SetStateAction<user>>
) => {
  try {
    const token = getToken();

    const resp = await axios.get<user>(APIUrl + "users/@me", {
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
      APIUrl + "users/@me",

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

export const createPlan = async (
  data: newPlan,
  user_id: number,
  setPlans: React.Dispatch<React.SetStateAction<plan[]>>
): Promise<any> => {
  // Specify the return type
  const maxRetryCount = 3; // Maximum number of retry attempts
  let retryCount = 0;

  const attemptRequest = async (): Promise<any> => {
    // Specify the return type
    const controller = new AbortController();
    const token = getToken();

    const newPlan: plan = {
      ...data,
      owner_id: user_id,
      id: 0.1,
      total_cost: 0,
      users: 0,
      date_created: "now",
    };
    setPlans((prevPlans) => [...prevPlans, newPlan]);

    try {
      const response = await axios.post<plan>(APIUrl + "plans/@me", data, {
        signal: controller.signal,
        headers: { Authorization: "Bearer " + token },
      });
      setPlans((prevPlans) => prevPlans.filter((plan) => plan.id !== 0.1));
      setPlans((prevPlans) => [...prevPlans, response.data]);
      return null;
    } catch (err) {
      setPlans((prevPlans) => prevPlans.filter((plan) => plan.id !== 0.1));
      await handleApiError(err);
      if (retryCount < maxRetryCount) {
        retryCount++;
        console.log(`Retrying request (attempt ${retryCount})...`);
        return attemptRequest(); // Retry the request
      } else {
        setPlans((prevPlans) => prevPlans.filter((plan) => plan.id !== 0.1));
        return await handleApiError(err); // Max retry attempts reached, handle the error
      }
    }
  };

  return attemptRequest();
};

export const deletePlan = async (
  plan_id: number,
  setPlans: React.Dispatch<React.SetStateAction<plan[]>>
) => {
  const controller = new AbortController();
  const token = getToken();

  let removedPlan: plan = {} as plan;

  setPlans((prevPlans) => {
    const updatedPlans = prevPlans.filter((plan) => {
      if (plan.id === plan_id) {
        removedPlan = plan; // Store the removed plan
        return false; // Exclude the plan from the updatedPlans array
      }
      return true;
    });
    return updatedPlans;
  });

  try {
    const response = await axios.delete(
      APIUrl + "plans/@me/" + plan_id.toString(),
      {
        signal: controller.signal,
        headers: { Authorization: "Bearer " + token },
      }
    );
    return;
  } catch (err) {
    if (removedPlan.id !== undefined) {
      setPlans((prevPlans) => [...prevPlans, removedPlan]);
    }
    return handleApiError(err);
  }
};
