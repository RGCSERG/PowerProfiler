import axios, { AxiosError } from "axios";
import { errorResponse } from "./interfaces";
import { cookies } from "./cookiemanagement";
import { refreshAccessToken } from "./HTTPRequests";
import { setToken } from "./UserManagement";

export const handleApiError = async (err: unknown, refresh?: boolean) => {
  if (refresh) {
    setToken("");
    cookies.remove("refresh_token");
    return ["", false]; // Early return if refresh flag is set
  }

  if (axios.isCancel(err)) {
    return ["", false];
  }

  if (!axios.isAxiosError(err)) {
    const errorMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    return [errorMessage, false]; // Set the error message in state
  }

  const axiosError = err as AxiosError<errorResponse>;

  if (!axiosError.response?.data) {
    const errorMessage = axiosError.message || "An error occurred";
    return [errorMessage, false]; // Set the error message in state
  }

  const detail = axiosError.response.data.detail;

  if (detail === "Signature has expired" || detail === "Not enough segments") {
    setToken("");
    const refresh_token = cookies.get("refresh_token");
    if (refresh_token) {
      await refreshAccessToken(refresh_token);
      return null; // Token refreshed successfully
    }
  }

  return detail; // Token not refreshed
};
