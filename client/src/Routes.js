import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./Pages/register/Register.js";
import Confirm from "./Pages/confirm/Confirm.js";
import PrivateRoutes from "./Utils/PrivateRoutes";

function RoutesProvider() {
  return (
    <BrowserRouter>
      <Routes>
        {/* EXAMPLES */}

        {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/test" element={<Register />} />
          <Route path="/register" element={<Register />} />
          <Route path="/confirm/:user_id" element={<Confirm />} />
        <Route element={<PrivateRoutes />}>
          {/* <Route path="/" exact element={<Home />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default RoutesProvider;
