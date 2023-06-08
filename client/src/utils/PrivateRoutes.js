import React, { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import MiniDrawer from "../components/drawer/MiniDrawer";
import useFirebase from "../hooks/useFirebase";
import Cookies from "universal-cookie";
import axios from "axios";

function PrivateRoutes() {
  const { user, logout } = useFirebase();
  const cookies = new Cookies();
  const navigate = useNavigate();

  useEffect(() => {
    const lastConnectionAt = cookies.get("lastConnectionAt");
    const token = cookies.get("token");
    const currentTime = Date.now();

    if (lastConnectionAt <= currentTime || !token) {
      logout();
      navigate("/login");
    }

    (async () => {
      await axios
        .post("http://10.160.33.226:5050/auth/login", {
          token,
        })
        .catch((err) => {
          logout();
          navigate("/login");
        });
    })();
  }, []);

  return user && <MiniDrawer element={<Outlet />} />;
}

export default PrivateRoutes;
