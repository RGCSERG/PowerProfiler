import { useEffect, useState } from "react";
import { cookies } from "../cookiemanagement";
import { refreshAccessToken, getAccessToken } from "../HTTPRequests";
import { Navigate } from "react-router-dom";
import { loginFormData } from "../interfaces";
import LoginFormPlaceHolder from "../components/LoginFormPlaceHolder";

const Login = () => {
  const [redirectToUser, setRedirectToUser] = useState(false);
  const [error, setError] = useState("");

  const handleError = (requestError: string | undefined) => {
    if (typeof requestError === "string") {
      setError(requestError);

      return; // Return early to prevent further execution
    } else if (requestError === undefined) {
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

    if (redirectToUser === true) {
      return;
    }

    const refresh = async (): Promise<any> => {
      if (!accessToken && refreshToken) {
        const err = await refreshAccessToken(refreshToken);

        handleError(err);
        if (err === undefined) {
          setRedirectToUser(true);
        }
      } else if (accessToken !== undefined && refreshToken) {
        setRedirectToUser(true);
      }
    };

    refresh();
  }, [redirectToUser]);

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
