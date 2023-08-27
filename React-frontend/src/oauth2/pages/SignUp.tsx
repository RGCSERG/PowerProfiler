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

  const handleTokenSubmit = async (user: signUpFormData) => {
    await createUser(user);
    await getAccessToken({ email: user.email, password: user.password });
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
      <SignUpFormPlaceHolder onSubmit={handleTokenSubmit} />
    </>
  );
};

export default SignUp;
