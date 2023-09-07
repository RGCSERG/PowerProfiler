import axios, { AxiosError } from "axios";
import { errorResponse } from "./interfaces";
import { cookies } from "./cookiemanagement";
import { refreshAccessToken } from "./HTTPRequests";
import { setToken } from "./UserManagement";

export const handleApiError = async (err: unknown, refresh?: boolean) => {
  if (refresh) {
    setToken("");
    cookies.remove("refresh_token");
  }
  if (axios.isCancel(err)) {
    return "";
  }

  if (axios.isAxiosError(err)) {
    const axiosError = err as AxiosError<errorResponse>;

    if (axiosError.response?.data) {
      setToken("");
      const refresh_token = cookies.get("refresh_token");
      if (refresh_token) {
        await refreshAccessToken(refresh_token);
      }

      return axiosError.response.data.detail;
    }

    const errorMessage = axiosError.message || "An error occurred";
    return errorMessage; // Set the error message in state
  } else {
    const errorMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    return errorMessage; // Set the error message in state
  }
};
