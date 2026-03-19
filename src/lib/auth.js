import Cookies from "js-cookie";

export const setToken = (token) => {
  Cookies.set("token", token, {
    expires: 7,
    path: "/",
    sameSite: "lax",
  });
};

export const getToken = () => {
  return Cookies.get("token");
};

export const removeToken = () => {
  Cookies.remove("token", { path: "/" });
};

export const isAuthenticated = () => {
  return !!Cookies.get("token");
};