import axios from "axios";
import React, {useEffect} from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {AuthProvider} from "./hooks/useAuth";
import "./index.css";
import Theme from "./utils/Theme";
import {FirebaseContextProvider} from "./hooks/useFirebase";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <>
    <Theme />
  </>
);
