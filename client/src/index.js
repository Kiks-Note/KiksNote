import axios from "axios";
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import {AuthProvider} from "./hooks/useAuth";
import { Provider } from 'react-redux'
import { store } from './redux/store';
import Theme from "./utils/Theme";

const root = ReactDOM.createRoot(document.getElementById("root"));


root.render(
  <Provider store={store}>
    <Theme />
  </Provider>
);
