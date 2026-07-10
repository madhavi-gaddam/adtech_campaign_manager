import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { CampaignProvider } from "./context/CampaignContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
    <CampaignProvider>
       <App />
    </CampaignProvider>
     
    </BrowserRouter>
  </React.StrictMode>
);