import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Layout, Header, Main } from "../components/Layout";
import { styled } from "../stitches.config";
import { Button } from "../components/Button";
import { usePokerService } from "../providers/PokerServiceProvider";
import { HoldemPokerSession } from "../types";

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
  gap: "24px",
  alignItems: "center",
});

type PokerSessionBase = Omit<HoldemPokerSession, "hands">;

export const SessionListPage: React.FC = () => {
  const navigate = useNavigate();

  const { socket } = usePokerService();

  const [pokerSessions, setPokerSessions] = useState<PokerSessionBase[] | null>(
    null
  );

  const sortedPokerSessions = useMemo(
    () => (pokerSessions ? [...pokerSessions].reverse() : null),
    [pokerSessions]
  );

  useEffect(() => {
    socket.emit("getSessions");

    socket.on("sessions", (sessions: PokerSessionBase[]) => {
      setPokerSessions(sessions);
    });

    return () => {
      socket.removeAllListeners("sessions");
    };
  }, [socket]);

  const handleJoinSession = (sessionId: string) => {
    navigate(`/sessions/${sessionId}`);
  };

  const handleCreateSession = () => {
    navigate(`/sessions/create`);
  };

  return (
    <Layout>
      <Header>
        <Button onClick={handleCreateSession}>Create session</Button>
      </Header>
      <Main>
        <SessionList>
          {sortedPokerSessions?.map((pokerSession) => (
            <SessionListItem key={pokerSession.id}>
              <div>
                <h2>Session: {pokerSession.name}</h2>
              </div>
              <Button onClick={() => handleJoinSession(pokerSession.id)}>
                Join
              </Button>
            </SessionListItem>
          ))}
        </SessionList>
      </Main>
    </Layout>
  );
};
