import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AppWrapper } from "./context/AppContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppWrapper>
      <App />
    </AppWrapper>
  </React.StrictMode>
);
