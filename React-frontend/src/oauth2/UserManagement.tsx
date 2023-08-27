export const setToken = (token: string) => {
  sessionStorage.setItem("accessToken", token);
};
export const getToken = () => {
  let temp = sessionStorage.getItem("accessToken");
  if (temp !== null) {
    return temp;
  } else {
    console.log("No user data found in session storage.");
    return null; // Return null or any other appropriate value
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
