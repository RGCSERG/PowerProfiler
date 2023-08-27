import { useEffect, useState } from "react";
import { cookies } from "../Cookies";
import { refreshAccessToken, getAccessToken } from "../HTTPRequests";
import { Navigate } from "react-router-dom";
import { loginFormData } from "../interfaces";
import LoginFormPlaceHolder from "../components/LoginFormPlaceHolder";

const Login = () => {
  const [redirectToUser, setRedirectToUser] = useState(false);

  const handleTokenSubmit = async (user: loginFormData) => {
    await getAccessToken(user);
    setRedirectToUser(true);
  };

  useEffect(() => {
    const refreshToken = cookies.get("refresh_token");
    const accessToken = sessionStorage.getItem("accessToken");

    if (!accessToken && refreshToken) {
      refreshAccessToken(refreshToken);
      setRedirectToUser(true);
    } else if (accessToken !== null) {
      setRedirectToUser(true);
    }
  }, []);

  if (redirectToUser) {
    return <Navigate to="/user" />;
  }

  return (
    <>
      <LoginFormPlaceHolder onSubmit={handleTokenSubmit} />
    </>
  );
};

export default Login;
