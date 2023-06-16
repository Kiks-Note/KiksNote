import React, {useEffect} from "react";
import {Navigate, Outlet, useNavigate} from "react-router-dom";
import MiniDrawer from "../components/drawer/MiniDrawer";
import useFirebase from "../hooks/useFirebase";
import Cookies from "universal-cookie";
import axios from "axios";

function PrivateRoutes() {
  const {user, logout} = useFirebase();
  const cookies = new Cookies();
  const navigate = useNavigate();

  const lastConnectionAt = cookies.get("lastConnectionAt");
  const token = cookies.get("token");
  const currentTime = Date.now();

  useEffect(() => {
    if (lastConnectionAt < currentTime || !token || !lastConnectionAt) {
      logout();
      navigate("/login");
    }
  }, [token, lastConnectionAt]);

  return user && <MiniDrawer element={<Outlet />} />;
}

export default PrivateRoutes;
