import axios from "axios";
import {accountAuthService} from "./accountAuth";

export const refreshToken = () => {
  const refreshToken = accountAuthService.getRefreshToken();

  const config = {
    headers: {Authorization: `Bearer ${refreshToken}`},
  };

  console.log(refreshToken);

  if (refreshToken) {
    axios
      .post(`${process.env.REACT_APP_SERVER_API}/auth/refreshToken`, {}, config)
      .then((response) => {
        console.log(response);
        accountAuthService.setToken(response.data.accessToken);
        console.log(response.data.accessToken);
      })
      .catch((error) => {
        console.error(error.response);
      });
  }
};
