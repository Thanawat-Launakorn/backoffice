//use token
const setToken = (access_token: string) => {
  return localStorage.setItem("id_token", access_token);
};

const getToken = () => {
  if (typeof window !== "undefined") {
    // 👉🏻 can use localStorage here, on browser
    const token = localStorage.getItem("id_token");
    return token;
  }

  return null;
};

const clearToken = () => {
  return localStorage.removeItem("id_token");
};

export const storage = {
  setToken,
  getToken,
  clearToken,
};
