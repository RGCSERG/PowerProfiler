import axios, { AxiosError } from "axios";
import { errorResponse } from "./interfaces";
import { cookies } from "./cookiemanagement";
import { refreshAccessToken } from "./HTTPRequests";
import { setToken } from "./UserManagement";

export const handleApiError = async (err: unknown) => {
  if (axios.isCancel(err)) {
    return "";
  }

  if (axios.isAxiosError(err)) {
    const axiosError = err as AxiosError<errorResponse>;
    if (
      axiosError.response?.data &&
      (axiosError.response.data.detail === "Signature has expired" ||
        axiosError.response.data.detail === "Not enough segments")
    ) {
      const refresh_token = cookies.get("refresh_token");
      if (refresh_token) {
        await refreshAccessToken(refresh_token);
      }
      setToken("");
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
