import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import MiniDrawer from "../components/drawer/MiniDrawer";
import { accountAuthService } from "../services/accountAuth";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

function PrivateRoutes() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated asynchronously using the accountAuthService.isLogged()
    const checkAuth = async () => {
      try {
        const result = await accountAuthService.isLogged();
        setAuthenticated(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Show loading indicator while authentication check is in progress
  if (loading) {
    return (
      <Box sx={{ display: "flex" }}>
        <CircularProgress />
      </Box>
    );
  }

  // If user is authenticated, allow access to all pages
  if (authenticated) {
    return <MiniDrawer element={<Outlet />} />;
  }

  // If user is not authenticated, redirect to login page only if user is not already on the login page
  const currentLocation = window.location.pathname;
  if (currentLocation == "/") {
    return <Navigate to="/login" />;
  }

  // If user is not authenticated and already on login page, allow access to login page
  return <Outlet />;
}

export default PrivateRoutes;
