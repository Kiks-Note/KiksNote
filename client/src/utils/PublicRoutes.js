import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import MiniDrawerNotConnected from "../components/drawer/MiniDrawerNotConnected";
import { accountAuthService } from "../services/accountAuth";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

function PublicRoutes() {
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
  // Redirect user to home page if already authenticated, else show
  return authenticated ? (
    <Navigate to="/" />
  ) : (
    <MiniDrawerNotConnected element={<Outlet />} />
  );
}

export default PublicRoutes;
