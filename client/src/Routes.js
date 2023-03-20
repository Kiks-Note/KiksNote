import { BrowserRouter, Route, Routes } from "react-router-dom";
import Test from "./pages/Test";
import Register from "./pages/register/Register"
import Login from "./pages/login/Login"
import PrivateRoutes from "./Utils/PrivateRoutes";

function RoutesProvider() {
  return (
    <BrowserRouter>
      <Routes>
        {/* EXAMPLES */}

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/test" element={<Test />} />

        <Route element={<PrivateRoutes />}>
          {/* <Route path="/" exact element={<Home />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default RoutesProvider;
