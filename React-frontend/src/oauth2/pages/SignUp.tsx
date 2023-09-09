import { useEffect, useState } from "react";
import { cookies } from "../cookiemanagement";
import { Navigate } from "react-router-dom";
import { signUpFormData } from "../interfaces";
import SignUpFormPlaceHolder from "../components/SignUpFormPlaceHolder";
import { getToken } from "../UserManagement";
import {
  refreshAccessToken,
  createUser,
  getAccessToken,
} from "../HTTPRequests";

interface Props {
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

const SignUp = ({ error, setError }: Props) => {
  const [redirectToUser, setRedirectToUser] = useState(false);

  const handleError = (requestError: string | undefined) => {
    if (typeof requestError === "string") {
      setError(requestError);
      return; // Return early to prevent further execution
    }
  };

  const handleTokenSubmit = async (user: signUpFormData) => {
    const err = await createUser(user);
    handleError(err);
    if (err === undefined) {
      const err = await getAccessToken({
        email: user.email,
        password: user.password,
      });
      handleError(err);
      if (err === undefined) {
        setRedirectToUser(true);
      }
    }
  };

  useEffect(() => {
    const refreshToken = cookies.get("refresh_token");
    const accessToken = getToken();

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
      <SignUpFormPlaceHolder onSubmit={handleTokenSubmit} error={error} />
    </>
  );
};

export default SignUp;
