import React from "react";
import {Navigate, Outlet} from "react-router-dom";
import MiniDrawer from "../components/navbar/Navbar";
import {accountAuthService} from "../services/accountAuth";
import useAuth from "../hooks/useAuth";

function PrivateRoutes() {
  const {user} = useAuth();
  return user ? <MiniDrawer element={<Outlet />} /> : <Navigate to="/login" />;
}

export default PrivateRoutes;
