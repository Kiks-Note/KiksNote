import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import FirebaseContextProvider from "./config/firebase";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <FirebaseContextProvider> */}
    <App />
    {/* </FirebaseContextProvider> */}
  </React.StrictMode>
);
