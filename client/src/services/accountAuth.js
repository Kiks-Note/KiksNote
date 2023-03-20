import jwt_decode from "jwt-decode";

const TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

let saveTokens = (accessToken, refreshToken) => {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

let isLogged = () => {
  let token = localStorage.getItem(TOKEN_KEY);
  return !!token;
};

let logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

let getAccessToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

let setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
}

let getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

let isAccessTokenExpired = () => {
  let accessToken = localStorage.getItem(TOKEN_KEY);
  if (!accessToken) {
    return true;
  }

  const decodedToken = jwt_decode(accessToken);
  const currentTime = Date.now() / 1000;

  return decodedToken.exp < currentTime;
};

export const accountAuthService = {
  saveTokens,
  isLogged,
  logout,
  getAccessToken,
  setToken,
  getRefreshToken,
  isAccessTokenExpired
};
