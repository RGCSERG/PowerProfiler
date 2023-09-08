import {
  loginFormData,
  tokenData,
  signUpFormData,
  user,
  plan,
  updatedUser,
  newPlan,
  TotalPlanData,
} from "./interfaces";
import axios from "axios";
import { getToken, setToken } from "./UserManagement";
import { cookies } from "./cookiemanagement";
import { handleApiError } from "./errors";
import { APIUrl } from "./constants";

const options = {
  secure: true,
  expires: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
};

export const getAccessToken = async (user: loginFormData): Promise<any> => {
  const maxRetryCount = 3; // Maximum number of retry attempts
  let retryCount = 0;

  const attemptRequest = async (): Promise<any> => {
    try {
      const response = await axios.post<tokenData>(APIUrl + "login", user);

      cookies.set("refresh_token", response.data.refresh_token, options);
      setToken(response.data.access_token);

      return undefined;
    } catch (err) {
      await handleApiError(err);

      if (retryCount < maxRetryCount) {
        retryCount++;
        console.log(`Retrying request (attempt ${retryCount})...`);

        return attemptRequest(); // Retry the request
      } else {
        return await handleApiError(err);
      } // Max retry attempts reached, handle the error
    }
  };
  return attemptRequest();
};

export const refreshAccessToken = async (
  refresh_token: string
): Promise<any> => {
  const maxRetryCount = 3; // Maximum number of retry attempts
  let retryCount = 0;

  const attemptRequest = async (): Promise<any> => {
    try {
      const response = await axios.post<tokenData>(
        APIUrl + "refresh",
        {},
        {
          headers: { Authorization: "Bearer " + refresh_token },
        }
      );

      setToken(response.data.access_token); // Make sure this sets the token correctly

      return undefined;
    } catch (err) {
      await handleApiError(err);

      if (retryCount < maxRetryCount) {
        retryCount++;
        console.log(`Retrying request (attempt ${retryCount})...`);

        return attemptRequest(); // Retry the request
      } else {
        return await handleApiError(err);
      }
    }
  };
  return attemptRequest();
};

export const createUser = async (user: signUpFormData): Promise<any> => {
  const maxRetryCount = 3; // Maximum number of retry attempts
  let retryCount = 0;

  const attemptRequest = async (): Promise<any> => {
    try {
      const response = await axios.post<user>(APIUrl + "users", user);

      return undefined;
    } catch (err) {
      await handleApiError(err);

      if (retryCount < maxRetryCount) {
        retryCount++;
        console.log(`Retrying request (attempt ${retryCount})...`);

        return attemptRequest(); // Retry the request
      } else {
        return await handleApiError(err);
      }
    }
  };
  return attemptRequest();
};

export const getUserPlans = async (
  setPlans: React.Dispatch<React.SetStateAction<plan[]>>
): Promise<any> => {
  const maxRetryCount = 3; // Maximum number of retry attempts
  let retryCount = 0;

  const attemptRequest = async (): Promise<any> => {
    try {
      const token = getToken();

      const response = await axios.get<plan[]>(APIUrl + "plans/@me", {
        headers: { Authorization: "Bearer " + token },
      });

      setPlans(response.data);

      return undefined;
    } catch (err) {
      await handleApiError(err);

      if (retryCount < maxRetryCount) {
        retryCount++;
        console.log(`Retrying request (attempt ${retryCount})...`);

        return attemptRequest(); // Retry the request
      } else {
        return await handleApiError(err);
      }
    }
  };
  return attemptRequest();
};

export const getUserData = async (
  setUserData: React.Dispatch<React.SetStateAction<user>>
): Promise<any> => {
  const maxRetryCount = 3; // Maximum number of retry attempts
  let retryCount = 0;

  const attemptRequest = async (): Promise<any> => {
    try {
      const token = getToken();

      const resp = await axios.get<user>(APIUrl + "users/@me", {
        headers: { Authorization: "Bearer " + token },
      });

      setUserData(resp.data);
    } catch (err) {
      await handleApiError(err);

      if (retryCount < maxRetryCount) {
        retryCount++;
        console.log(`Retrying request (attempt ${retryCount})...`);

        return attemptRequest(); // Retry the request
      } else {
        return await handleApiError(err);
      }
    }
  };
  return attemptRequest();
};

export const updateUser = async (
  newUser: updatedUser,
  userData: user,
  setUserData: React.Dispatch<React.SetStateAction<user>>,
  signOut: () => void
): Promise<any> => {
  const oldData = userData;

  const maxRetryCount = 3; // Maximum number of retry attempts
  let retryCount = 0;

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

  const attemptRequest = async (): Promise<any> => {
    try {
      const token = getToken();

      // Perform API request
      const response = await axios.put<user>(
        APIUrl + "users/@me",
        updatedUserData,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );

      if (newUser.email !== undefined) {
        // Signout user if they changed their email
        signOut();
        return;
      }

      setUserData(response.data);

      return undefined;
    } catch (err) {
      await handleApiError(err);

      if (retryCount < maxRetryCount) {
        retryCount++;
        console.log(`Retrying request (attempt ${retryCount})...`);

        return attemptRequest(); // Retry the request
      } else {
        setUserData(oldData);

        return await handleApiError(err);
      }
    }
  };
  return attemptRequest();
};

export const createPlan = async (
  data: newPlan,
  user_id: number,
  setPlans: React.Dispatch<React.SetStateAction<plan[]>>
): Promise<any> => {
  const maxRetryCount = 3; // Maximum number of retry attempts
  let retryCount = 0;

  const newPlan: plan = {
    ...data,
    owner_id: user_id,
    id: 0.1,
    total_cost: 0,
    users: 0,
    date_created: "now",
  };
  setPlans((prevPlans) => [...prevPlans, newPlan]);

  const attemptRequest = async (): Promise<any> => {
    try {
      const token = getToken();

      const response = await axios.post<plan>(APIUrl + "plans/@me", data, {
        headers: { Authorization: "Bearer " + token },
      });

      setPlans((prevPlans) => prevPlans.filter((plan) => plan.id !== 0.1));
      setPlans((prevPlans) => [...prevPlans, response.data]);

      return undefined;
    } catch (err) {
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
): Promise<any> => {
  const maxRetryCount = 3; // Maximum number of retry attempts
  let retryCount = 0;

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

  const attemptRequest = async (): Promise<any> => {
    try {
      const token = getToken();

      const response = await axios.delete(
        APIUrl + "plans/@me/" + plan_id.toString(),
        {
          headers: { Authorization: "Bearer " + token },
        }
      );

      return undefined;
    } catch (err) {
      await handleApiError(err);

      if (retryCount < maxRetryCount) {
        retryCount++;
        console.log(`Retrying request (attempt ${retryCount})...`);

        return attemptRequest(); // Retry the request
      } else {
        if (removedPlan.id !== undefined) {
          setPlans((prevPlans) => [...prevPlans, removedPlan]);
        }

        return await handleApiError(err); // Max retry attempts reached, handle the error
      }
    }
  };

  return attemptRequest();
};

export const getIndividualPlan = async (
  id: number,
  setIndividualPLan: React.Dispatch<React.SetStateAction<TotalPlanData>>
): Promise<any> => {
  const maxRetryCount = 3; // Maximum number of retry attempts
  let retryCount = 0;

  const attemptRequest = async (): Promise<any> => {
    try {
      const token = getToken();

      const response = await axios.get<TotalPlanData>(
        APIUrl + "plans/@me/" + id.toString(),
        {
          headers: { Authorization: "Bearer " + token },
        }
      );

      setIndividualPLan(response.data);

      return undefined;
    } catch (err) {
      await handleApiError(err);

      if (retryCount < maxRetryCount) {
        retryCount++;
        console.log(`Retrying request (attempt ${retryCount})...`);

        return attemptRequest(); // Retry the request
      } else {
        return await handleApiError(err); // Max retry attempts reached, handle the error
      }
    }
  };

  return attemptRequest();
};
