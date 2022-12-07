import { BrowserRouter, Route, Routes } from "react-router-dom";
import Test from "./pages/Test";
import PrivateRoutes from "./Utils/PrivateRoutes";
import ResetPassword from "./pages/resetpassword/passwordform/ResetPassword"

function RoutesProvider() {
  return (
    <BrowserRouter>
      <Routes>
        {/* EXAMPLES */}

        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/test" element={<Test />} />
        <Route path="/resetPass" element={<ResetPassword />} />

        <Route element={<PrivateRoutes />}>
          {/* <Route path="/" exact element={<Home />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default RoutesProvider;
