import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Layout, Header, Main, CenterWrapper } from "../components/Layout";
import { Button } from "../components/Button";
import { usePokerService } from "../providers/PokerServiceProvider";
import { TextInput } from "../components/TextInput";

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
        <CenterWrapper>
          <TextInput
            label="Session name"
            type="text"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
          ></TextInput>
          <Button onClick={handleSubmit} disabled={!sessionName}>
            Create session
          </Button>
        </CenterWrapper>
      </Main>
    </Layout>
  );
};
