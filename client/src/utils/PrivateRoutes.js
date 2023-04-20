import React from "react";
import {Navigate, Outlet} from "react-router-dom";
import MiniDrawer from "../components/navbar/Navbar";
import useFirebase from "../hooks/useFirebase";

function PrivateRoutes() {
  const {user} = useFirebase();
  console.log(user);

  return user ? <MiniDrawer element={<Outlet />} /> : <Navigate to="/login" />;
}

export default PrivateRoutes;
