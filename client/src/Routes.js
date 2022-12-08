import { BrowserRouter, Route, Routes } from "react-router-dom";
import Appel from "./Pages/appel/Appel";
import Test from "./Pages/Test";
import PrivateRoutes from "./Utils/PrivateRoutes";
import Navbar from "./components/navbar/Navbar";
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

        <Route element={<PrivateRoutes />}>
          <Route path="/appel" element={<Appel/>}/>
          {/* <Route path="/" exact element={<Home />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default RoutesProvider;
