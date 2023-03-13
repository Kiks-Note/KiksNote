import React from "react";
import {Navigate, Outlet} from "react-router-dom";
import FloatingSidebar from "../components/navbar/FloatingSidebar";
import MiniDrawer from "../components/navbar/Navbar";

function PrivateRoutes() {
  let auth = true;

  return auth ? (
    <FloatingSidebar element={<Outlet />} />
  ) : (
    <Navigate to="/login" />
  );
}

export default PrivateRoutes;
