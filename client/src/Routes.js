import { BrowserRouter, Route, Routes } from "react-router-dom";
import Test from "./pages/Test";
import PrivateRoutes from "./utils/PrivateRoutes";
import Navbar from "./components/navbar/Navbar";
import Profile from "./pages/profile/Profile";
function RoutesProvider() {
  return (
    <BrowserRouter>
      <Routes>
        {/* EXAMPLES */}

        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/register" element={<Register />} /> */}
        {/* To Use the Navbar change Test by your page
 <Route path="/test" element={<Navbar element={<Test />} />} /> */}
        <Route path="/" element={<Navbar element={<Test />} />} />
        <Route path="/test" element={<Navbar element={<Test />} />} />
        <Route path="/profile" element={<Navbar element={<Profile name='Alan' />} />} />
        <Route element={<PrivateRoutes />}>
          {/* <Route path="/" exact element={<Home />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default RoutesProvider;
