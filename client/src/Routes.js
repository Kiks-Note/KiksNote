import { BrowserRouter, Route, Routes } from "react-router-dom";
import Test from "./Pages/Test";
import Profile from "./Pages/profile/Profile";
import PrivateRoutes from "./Utils/PrivateRoutes";

function RoutesProvider() {
  return (
    <BrowserRouter>
      <Routes>
        {/* EXAMPLES */}

        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/test" element={<Test />} />
        <Route path="/profile" element={<Profile />} />
        <Route element={<PrivateRoutes />}>
          {/* <Route path="/" exact element={<Home />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default RoutesProvider;
