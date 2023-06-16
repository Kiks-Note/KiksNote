import React, {useState, useEffect} from "react";
import {Navigate, Outlet, useNavigate} from "react-router-dom";
import MiniDrawerNotConnected from "../components/drawer/MiniDrawerNotConnected";
import useFirebase from "../hooks/useFirebase";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Cookies from "universal-cookie";

function PublicRoutes() {
  const cookies = new Cookies();
  const {user} = useFirebase();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = cookies.get("token");
    if (!token || !user) {
      setAuthenticated(false);
      setLoading(false);
    }
  }, []);

  // Show loading indicator while authentication check is in progress
  if (loading) {
    return (
      <Box sx={{display: "flex"}}>
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
