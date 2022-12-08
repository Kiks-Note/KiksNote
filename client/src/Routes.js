import { BrowserRouter, Route, Routes } from "react-router-dom";
import Appel from "./pages/appel/Appel";
import Test from "./pages/Test";
import PrivateRoutes from "./utils/PrivateRoutes";
import Navbar from "./components/navbar/Navbar";

import Home from "./pages/home/Home.js";
import Blog from "./pages/blog/Blog";
import Login from "./pages/login/Login.js";

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

        <Route element={<PrivateRoutes />}>
          <Route path="/appel" element={<Appel />} />
          {/* <Route path="/" exact element={<Home />} /> */}
                              <Route path="/" element={<Home/>}/>
                    <Route path="/blog" element={<Blog/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );

}

export default RoutesProvider;
