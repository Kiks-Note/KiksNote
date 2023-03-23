import { BrowserRouter, Route, Routes, useParams } from "react-router-dom";
import Appel from "./pages/call/Call";
import Test from "./pages/Test";
import PrivateRoutes from "./utils/PrivateRoutes";
import Navbar from "./components/navbar/Navbar";
import Presence from "./pages/presence/Presence";
import Home from "./pages/home/Home.js";
import Blog from "./pages/blog/Blog";
import Login from "./pages/login/Login.js";

function RoutesProvider() {
    return (
        <BrowserRouter>
            <Routes>
                {/* EXAMPLES */}

                {/*<Route path="/login" element={<Login />} />*/}
                {/* <Route path="/register" element={<Register />} /> */}
                {/* To Use the Navbar change Test by your page
                <Route path="/test" element={<Navbar element={<Test />} />} /> */}
                
                {/*<Route path="/" element={<Navbar element={<Test/>}/>}/>*/}
                {/*<Route path="/test" element={<Navbar element={<Test/>}/>}/>*/}

        <Route element={<PrivateRoutes />}>
          <Route path="/appel" element={<Navbar element={<Appel />} />} />
          <Route
            path="/presence/:id"
            element={<Navbar element={<Presence />} />}
          />
                    <Route path="/" element={<Home/>}/>
                    <Route path="/blog" element={<Blog/>}/>
          {/* <Route path="/" exact element={<Home />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default RoutesProvider;
