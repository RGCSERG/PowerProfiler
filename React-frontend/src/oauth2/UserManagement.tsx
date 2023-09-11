import { useNavigate } from "react-router-dom";
import { cookies } from "./cookiemanagement";

export const setToken = (token: string) => {
  if (token === "") {
    sessionStorage.removeItem("accessToken");
    return;
  }
  sessionStorage.setItem("accessToken", token);
};

export const getToken = () => {
  let temp = sessionStorage.getItem("accessToken");
  if (temp !== undefined) {
    return temp;
  } else {
    console.log("No user data found in session storage.");
    return undefined;
  }
};

export const signOut = () => {
  const navigate = useNavigate();

  sessionStorage.clear();
  cookies.remove("refresh_token");
  navigate(`/`);
};
// export const setUser = (data: User) => {
//   sessionStorage.setItem("userData", JSON.stringify(data));
// };

// export const getUser = () => {
//   let temp = sessionStorage.getItem("userData");
//   if (temp !== undefined) {
//     return JSON.parse(temp) as User;
//   } else {
//     console.log("No user data found in session storage.");
//   }
// };
