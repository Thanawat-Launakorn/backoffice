const setToken = (access_token: string) => {
  return localStorage.setItem("id_token", access_token);
};

const getToken = () => {
  const token = localStorage.getItem("id_token");
  if (!token) {
    console.warn("Missing ID token in localStorage");
    return;
  }
  return token;
};

const clearToken = () => {
  return localStorage.removeItem("id_token");
};

export const storage = {
  setToken,
  getToken,
  clearToken,
};
