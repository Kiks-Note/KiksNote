import { BrowserRouter, Route, Routes } from "react-router-dom";
import Appel from "./pages/call/Call";
<<<<<<< Updated upstream
import Home from "./pages/home/Home";
import Blog from "./pages/blog/Blog";
import Login from "./pages/login/Login";
import Presence from "./pages/presence/Presence";
import Groups from "./pages/groups/Groups";
import Register from "./pages/register/Register";
=======
import Presence from "./pages/presence/Presence";
import Home from "./pages/home/Home.js";
import Blog from "./pages/blog/Blog";
import Login from "./pages/login/Login.js";

import Groups from "./pages/groups/Groups";
>>>>>>> Stashed changes
import PrivateRoutes from "./utils/PrivateRoutes";
import Navbar from "./components/navbar/Navbar";

function RoutesProvider() {
  return (
    <BrowserRouter>
      <Routes>
<<<<<<< Updated upstream
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
=======
        {/* EXAMPLES */}

        <Route path="/login" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}
        {/* To Use the Navbar change Test by your page
                <Route path="/test" element={<Navbar element={<Test />} />} /> */}

        {/*<Route path="/" element={<Navbar element={<Test/>}/>}/>*/}
        {/*<Route path="/test" element={<Navbar element={<Test/>}/>}/>*/}

        {/* <Route path="/register" element={<Register />} /> */}
>>>>>>> Stashed changes

        <Route element={<PrivateRoutes />}>
          <Route path="/appel" element={<Navbar element={<Appel />} />} />
          <Route
            path="/presence/:id"
            element={<Navbar element={<Presence />} />}
          />
          <Route path="/groups" element={<Navbar element={<Groups />} />} />
<<<<<<< Updated upstream
=======
          {/* <Route path="/" exact element={<Home />} /> */}
>>>>>>> Stashed changes
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default RoutesProvider;
