import { BrowserRouter, Route, Routes } from "react-router-dom";
import Call from "./pages/call/Call";
import Groups from "./pages/groups/Groups";
import PrivateRoutes from "./utils/PrivateRoutes";
import Navbar from "./components/navbar/Navbar";

function RoutesProvider() {
  return (
    <BrowserRouter>
      <Routes>
        {/* EXAMPLES */}

        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/register" element={<Register />} /> */}

        <Route element={<PrivateRoutes />}>
          <Route path="/call" element={<Navbar element={<Call />} />} />
          <Route path="/groups" element={<Navbar element={<Groups />} />} />
          {/* <Route path="/" exact element={<Home />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default RoutesProvider;
