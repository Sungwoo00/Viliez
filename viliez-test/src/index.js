import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContxt";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
// import reportWebVitals from './reportWebVitals';

import "./index.css";
import "normalize.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
    <ToastContainer limit={2} position='top-center' />
  </React.StrictMode>
);

serviceWorkerRegistration.register();

// reportWebVitals();
