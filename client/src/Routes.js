import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./Pages/register/Register.js";
import Confirm from "./Pages/confirm/Confirm.js";
import CreateRetro from "./Pages/createretro/CreateRetro.js";
import Retrospective from "./Pages/retrospective/Retrospective.js";
import PrivateRoutes from "./Utils/PrivateRoutes";

function RoutesProvider() {
  return (
    <BrowserRouter>
      <Routes>
        {/* EXAMPLES */}

        {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/register" element={<Register />} />
          <Route path="/confirm/:user_id" element={<Confirm />} />
          <Route path="/createretro" element={<CreateRetro />} />
          <Route path="/retrospective/:retro_id" element={<Retrospective />} />
        <Route element={<PrivateRoutes />}>
          {/* <Route path="/" exact element={<Home />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default RoutesProvider;
