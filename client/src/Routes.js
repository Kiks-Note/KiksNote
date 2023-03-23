import { BrowserRouter, Route, Routes, useParams } from "react-router-dom";
import Appel from "./pages/call/Call";
import Test from "./pages/Test";

import Home from "./pages/home/Home.js";
import Blog from "./pages/blog/Blog";
import Login from "./pages/login/Login.js";

import Groups from "./Pages/groups/Groups";
import PrivateRoutes from "./utils/PrivateRoutes";
import Navbar from "./components/navbar/Navbar";

function RoutesProvider() {
    return (
        <BrowserRouter>
            <Routes>
                {/* EXAMPLES */}

                <Route path="/login" element={<Login />} />
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
          <Route path="/call" element={<Navbar element={<Call />} />} />
          <Route path="/groups" element={<Navbar element={<Groups />} />} />
          {/* <Route path="/" exact element={<Home />} /> */}
                              <Route path="/" element={<Home/>}/>
                    <Route path="/blog" element={<Blog/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );

}

export default RoutesProvider;
