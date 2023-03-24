import { BrowserRouter, Route, Routes } from "react-router-dom";
import Appel from "./Pages/call/Call";
import Home from "./Pages/home/Home";
import Blog from "./Pages/blog/Blog";
import Login from "./Pages/login/Login";
import Presence from "./Pages/presence/Presence";
import Groups from "./Pages/groups/Groups";
import Register from "./Pages/register/Register";
import PrivateRoutes from "./utils/PrivateRoutes";
import Navbar from "./components/navbar/Navbar";

function RoutesProvider() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<PrivateRoutes />}>
          <Route path="/appel" element={<Navbar element={<Appel />} />} />
          <Route
            path="/presence/:id"
            element={<Navbar element={<Presence />} />}
          />
          <Route path="/groups" element={<Navbar element={<Groups />} />} />
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );

}

export default RoutesProvider;
