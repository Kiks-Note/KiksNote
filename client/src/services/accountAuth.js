import jwt_decode from "jwt-decode";

// Define constant variables for token keys
const TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

// Function to save access and refresh tokens to local storage
let saveTokens = (accessToken, refreshToken) => {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

// Function to check if user is logged in by checking if access token is present in local storage
let isLogged = () => {
  let token = localStorage.getItem(TOKEN_KEY);
  return !!token;
};

// Function to log out by removing access and refresh tokens from local storage
let logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// Function to get access token from local storage
let getAccessToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Function to set access token in local storage
let setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Function to get refresh token from local storage
let getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

// Function to check if access token has expired
let isAccessTokenExpired = () => {
  let accessToken = localStorage.getItem(TOKEN_KEY);
  if (!accessToken) {
    return true;
  }

  // Decode the access token to get the expiration time
  const decodedToken = jwt_decode(accessToken);
  const currentTime = Date.now() / 1000;

  // Compare the expiration time with the current time to check if token is expired
  return decodedToken.exp < currentTime;
};

// Export an object with all the authentication functions
export const accountAuthService = {
  saveTokens,
  isLogged,
  logout,
  getAccessToken,
  setToken,
  getRefreshToken,
  isAccessTokenExpired,
};
