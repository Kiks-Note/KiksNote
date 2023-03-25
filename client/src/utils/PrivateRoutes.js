import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import MiniDrawer from "../components/drawer/MiniDrawer";
import { accountAuthService } from "../services/accountAuth";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

function PrivateRoutes() {
  const [authenticated, setAuthenticated] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated asynchronously using the accountAuthService.isLogged() function
    // const checkAuth = async () => {
    //   try {
    //     const result = await accountAuthService.isLogged();
    //     setAuthenticated(result);
    //   } catch (error) {
    //     console.error(error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    //checkAuth();
    setAuthenticated(true);
  }, []);

  // Show loading indicator while authentication check is in progress
  //
  if (loading) {
    <Box sx={{ display: "flex" }}>
      <CircularProgress />
    </Box>;
  }

  // If user is authenticated, show MiniDrawer component with child components
  // If user is not authenticated, redirect to login page
  return authenticated ? (
    <MiniDrawer element={<Outlet />} />
  ) : (
    <Navigate to="/login" />
  );
}

export default PrivateRoutes;
