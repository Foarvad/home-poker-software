import { useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import { SessionListPage } from "./pages/SessionListPage";
import { SessionPage } from "./pages/SessionPage";
import { CreateSessionPage } from "./pages/CreateSessionPage";
import { SessionManagerPage } from "./pages/SessionManagerPage";

import { globalCss } from "./stitches.config";
import "./App.css";

const globalStyles = globalCss({
  "*": {
    color: "$text",
  },
});

export const App: React.FC = () => {
  globalStyles();

  const wrapperRef = useRef<HTMLDivElement>(null);

  const setWindowHeight = () => {
    if (wrapperRef.current) {
      wrapperRef.current.style.height = `${window.innerHeight}px`;
    }
  };

  // Set page height to current inner height using JS (because IOS toolbar overflows content if we set height to 100vh)
  useEffect(() => {
    setWindowHeight();

    addEventListener("resize", setWindowHeight);
    return () => {
      removeEventListener("resize", setWindowHeight);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/sessions" element={<SessionListPage />} />
        <Route path="/sessions/create" element={<CreateSessionPage />} />
        <Route path="/sessions/:sessionId" element={<SessionPage />} />
        <Route
          path="/sessions/:sessionId/manage"
          element={<SessionManagerPage />}
        />
        <Route path="*" element={<Navigate to="/sessions" replace />} />
      </Routes>
    </Router>
  );
};
