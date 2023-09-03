import { useEffect, useState } from "react";
import { cookies } from "../Cookies";
import { refreshAccessToken, getAccessToken } from "../HTTPRequests";
import { Navigate } from "react-router-dom";
import { loginFormData } from "../interfaces";
import LoginFormPlaceHolder from "../components/LoginFormPlaceHolder";

const Login = () => {
  const [redirectToUser, setRedirectToUser] = useState(false);
  const [error, setError] = useState("");

  const handleError = (requestError: any) => {
    if (typeof requestError === "string") {
      setError(requestError);
    } else if (typeof requestError !== "string") {
      setRedirectToUser(true);
    }
  };

  const handleTokenSubmit = async (user: loginFormData) => {
    const requestError = await getAccessToken(user);
    handleError(requestError);
  };

  useEffect(() => {
    const refreshToken = cookies.get("refresh_token");
    const accessToken = sessionStorage.getItem("accessToken");

    const fetchData = async () => {
      if (!accessToken && refreshToken) {
        // Wait for refreshAccessToken to complete
        const requestError = await refreshAccessToken(refreshToken);
        handleError(requestError);
      } else if (accessToken !== null) {
        setRedirectToUser(true);
      }
    };

    fetchData();
  }, []);

  if (redirectToUser) {
    return <Navigate to="/user" />;
  }

  return (
    <>
      <LoginFormPlaceHolder onSubmit={handleTokenSubmit} error={error} />
    </>
  );
};

export default Login;
