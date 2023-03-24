import { BrowserRouter, Route, Routes } from "react-router-dom";
import Appel from "./pages/call/Call";
import Home from "./pages/home/Home";
import Blog from "./pages/blog/Blog";
import Login from "./pages/login/Login";
import Presence from "./pages/presence/Presence";
import Groups from "./pages/groups/Groups";
import Register from "./pages/register/Register";

import PrivateRoutes from "./utils/PrivateRoutes";
import Navbar from "./components/navbar/Navbar";

function RoutesProvider() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* EXAMPLES */}
        {/* <Route path="/register" element={<Register />} /> */}
        {/* To Use the Navbar change Test by your page
                <Route path="/test" element={<Navbar element={<Test />} />} /> */}

        {/*<Route path="/" element={<Navbar element={<Test/>}/>}/>*/}
        {/*<Route path="/test" element={<Navbar element={<Test/>}/>}/>*/}

        {/* <Route path="/register" element={<Register />} /> */}

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
