import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Layout, Header, Main } from "../components/Layout";
import { Button } from "../components/Button";
import { usePokerService } from "../providers/PokerServiceProvider";

export const CreateSessionPage: React.FC = () => {
  const navigate = useNavigate();

  const [sessionName, setSessionName] = useState("");

  const { socket } = usePokerService();

  const handleSubmit = () => {
    socket.emit("createSession", { name: sessionName });

    // TODO: Navigate to session management page
    navigate(`/sessions`);
  };

  return (
    <Layout>
      <Header />
      <Main>
        <input
          type="text"
          value={sessionName}
          onChange={(e) => setSessionName(e.target.value)}
        ></input>
        <Button onClick={handleSubmit} disabled={!sessionName}>
          Create session
        </Button>
      </Main>
    </Layout>
  );
};
