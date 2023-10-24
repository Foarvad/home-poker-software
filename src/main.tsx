import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "./App";
import { PokerServiceProvider } from "./providers/PokerServiceProvider";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PokerServiceProvider>
      <App />
    </PokerServiceProvider>
  </React.StrictMode>
);
