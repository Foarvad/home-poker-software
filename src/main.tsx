import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "./App";
import { PokerServiceProvider } from "./providers/PokerServiceProvider";

import "./index.css";
import { AppConfigProvider } from "./providers/AppConfigProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppConfigProvider>
      <PokerServiceProvider>
        <App />
      </PokerServiceProvider>
    </AppConfigProvider>
  </React.StrictMode>
);
