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
  // Redirect user to login page if user not authenticated
  return authenticated ? (
    <MiniDrawer element={<Outlet />} />
  ) : (
    <Navigate to="/login" />
  );
}

export default PrivateRoutes;
