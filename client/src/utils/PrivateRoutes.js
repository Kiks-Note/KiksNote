import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import MiniDrawer from "../components/navbar/Navbar";

import { accountAuthService } from "../services/accountAuth";

function PrivateRoutes() {

    return accountAuthService.isLogged() ? <MiniDrawer element={<Outlet />} /> : <Navigate to="/login" /> && <Navigate to="/resetpassword" />;

}

export default PrivateRoutes;
