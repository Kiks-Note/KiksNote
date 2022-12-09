import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from "./Pages/login/Login"
import Test from "./Pages/Test";
import PrivateRoutes from "./utils/PrivateRoutes";

import Home from "./pages/home/Home.js";
import Blog from "./pages/blog/Blog";

function RoutesProvider() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PrivateRoutes/>}>
                    {/* Write here route that you need to be login*/}
                    <Route path="/test" element={<Test />} />
                    <Route path="/login" element={<Login />} /> 

                    <Route path="/" element={<Home/>}/>
                    <Route path="/blog" element={<Blog/>}/>

                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default RoutesProvider;
