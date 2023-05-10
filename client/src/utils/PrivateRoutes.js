import React, { useEffect } from "react";
import {Navigate, Outlet, useNavigate} from "react-router-dom";
import MiniDrawer from "../components/navbar/Navbar";
import useFirebase from "../hooks/useFirebase";
import Cookies from "universal-cookie";

function PrivateRoutes() {
  const {user, logout} = useFirebase();
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
    console.log(lastConnectionAt, currentTime);
  }, []);

  return user && <MiniDrawer element={<Outlet />} />;
}

export default PrivateRoutes;
