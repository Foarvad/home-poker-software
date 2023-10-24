import React, { useEffect, useState, useContext } from "react";
import { Layout, Header, Main } from "../components/Layout";
import { styled } from "../stitches.config";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { usePokerService } from "../providers/PokerServiceProvider";

interface Session {
  id: string;
  name: string;
  status: string;
}

const SessionList = styled("ul", {
  listStyleType: "none",
  padding: 0,
  width: "100%",
  maxWidth: "600px",
});

const SessionListItem = styled("li", {
  backgroundColor: "$background",
  marginBottom: "24px",
  padding: "24px",
  borderRadius: "8px",
  boxShadow: "$card",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  "@media $mobile": {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  "@media $tablet": {
    flexDirection: "row",
    alignItems: "center",
  },
  "@media $desktop": {
    flexDirection: "row",
    alignItems: "center",
  },
});

export const SessionListPage: React.FC = () => {
  const navigate = useNavigate();

  const { socket, pokerSessions } = usePokerService();

  useEffect(() => {
    socket.emit('getSessions');
  }, [socket]);

  const handleJoinSession = (sessionId: string) => {
    navigate(`/sessions/${sessionId}`);
    // socket.emit('joinSession', { sessionId });
  };

  const handleCreateSession = () => {
    navigate(`/sessions/create`);
  };

  return (
    <Layout>
      <Header>
        <div>Home Poker Software</div>
        <div>
          <Button onClick={handleCreateSession}>Create session</Button>
        </div>
      </Header>
      <Main>
        <SessionList>
          {pokerSessions?.map((session) => (
            <SessionListItem key={session.id}>
              <div>
                <h2>Session: {session.name}</h2>
                <p>Status: {session.status}</p>
              </div>
              <Button onClick={() => handleJoinSession(session.id)}>
                Join
              </Button>
            </SessionListItem>
          ))}
        </SessionList>
      </Main>
    </Layout>
  );
};
