import { useEffect, useState } from "react";
import { cookies } from "../Cookies";
import { refreshAccessToken, getAccessToken } from "../HTTPRequests";
import { Navigate } from "react-router-dom";
import { loginFormData } from "../interfaces";
import LoginFormPlaceHolder from "../components/LoginFormPlaceHolder";

const Login = () => {
  const [redirectToUser, setRedirectToUser] = useState(false);
  const [error, setError] = useState("");

  const handleTokenSubmit = async (user: loginFormData) => {
    const error = await getAccessToken(user);
    if (typeof error === "string") {
      setError(error);
    } else if (typeof error !== "string") {
      setRedirectToUser(true);
    }
  };

  useEffect(() => {
    const refreshToken = cookies.get("refresh_token");
    const accessToken = sessionStorage.getItem("accessToken");

    const fetchData = async () => {
      if (!accessToken && refreshToken) {
        // Wait for refreshAccessToken to complete
        await refreshAccessToken(refreshToken);
        if (!error) {
          setRedirectToUser(true);
        }
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
