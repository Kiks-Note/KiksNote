import { BrowserRouter, Route, Routes } from "react-router-dom";
import Appel from "./Pages/appel/Appel";
import Test from "./Pages/Test";
import PrivateRoutes from "./Utils/PrivateRoutes";

function RoutesProvider() {
  return (
    <BrowserRouter>
      <Routes>
        {/* EXAMPLES */}

        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/test" element={<Test />} />

        <Route element={<PrivateRoutes />}>
          <Route path="/appel" element={<Appel/>}/>
          {/* <Route path="/" exact element={<Home />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default RoutesProvider;
