import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoutes from "./utils/PrivateRoutes";
import Navbar from "./components/navbar/Navbar";

import Home from "./pages/home/Home.js";
import Blog from "./pages/blog/Blog.js";
import Test from "./pages/Test";
import Register from "./pages/register/Register"
import Login from "./pages/login/Login"

function RoutesProvider() {
  return (
    <BrowserRouter>
      <Routes>
        {/* EXAMPLES */}

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/test" element={<Test />} />

                <Route element={<PrivateRoutes/>}>
                    {/* Write here route that you need to be login*/}

                    <Route path="/" element={<Home/>}/>
                    <Route path="/blog" element={<Blog/>}/>

                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default RoutesProvider;
