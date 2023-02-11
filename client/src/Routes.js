import { BrowserRouter, Route, Routes } from "react-router-dom";
import Test from "./Pages/Test";
import PrivateRoutes from "./Utils/PrivateRoutes";
import AskResetPassword from './Pages/resetpassword/AskResetPassword'
import ResetPassword from './Pages/resetpassword/ResetPassword'

function RoutesProvider() {
  return (
    <BrowserRouter>
      <Routes>
        {/* EXAMPLES */}

        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/test" element={<Test />} />
        <Route path="/askresetpass" element={<AskResetPassword />} />
        <Route path="/resetpass" element={<ResetPassword />} />
        <Route element={<PrivateRoutes />}>
          {/* <Route path="/" exact element={<Home />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default RoutesProvider;
