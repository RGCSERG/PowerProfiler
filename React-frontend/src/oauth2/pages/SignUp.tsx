import { useEffect, useState } from "react";
import { cookies } from "../Cookies";
import {
  refreshAccessToken,
  createUser,
  getAccessToken,
} from "../HTTPRequests";
import { Navigate } from "react-router-dom";
import { signUpFormData } from "../interfaces";
import SignUpFormPlaceHolder from "../components/SignUpFormPlaceHolder";

const SignUp = () => {
  const [redirectToUser, setRedirectToUser] = useState(false);
  const [error, setError] = useState("");

  const handleError = (error: unknown) => {
    if (typeof error === "string") {
      setError(error);
    } else if (typeof error !== "string") {
      setRedirectToUser(true);
    }
  };

  const handleTokenSubmit = async (user: signUpFormData) => {
    const err = await createUser(user);
    handleError(err);
    if (!error) {
      const err = await getAccessToken({
        email: user.email,
        password: user.password,
      });
      handleError(err);
    }
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
      <SignUpFormPlaceHolder onSubmit={handleTokenSubmit} error={error} />
    </>
  );
};

export default SignUp;
