export const setToken = (token: string) => {
  if (token === "") {
    sessionStorage.removeItem("accessToken");
    return;
  }
  sessionStorage.setItem("accessToken", token);
};

export const getToken = () => {
  let temp = sessionStorage.getItem("accessToken");
  if (temp !== null) {
    return temp;
  } else {
    console.log("No user data found in session storage.");
    return null;
  }
};
// export const setUser = (data: User) => {
//   sessionStorage.setItem("userData", JSON.stringify(data));
// };

// export const getUser = () => {
//   let temp = sessionStorage.getItem("userData");
//   if (temp !== null) {
//     return JSON.parse(temp) as User;
//   } else {
//     console.log("No user data found in session storage.");
//   }
// };
