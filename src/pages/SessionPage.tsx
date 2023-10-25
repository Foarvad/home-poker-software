import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { Layout, Header, Main } from "../components/Layout";
import { EnterUsername } from "../features/EnterUsername";
import { usePokerService } from "../providers/PokerServiceProvider";
import { HoldemPokerSession } from "../types";

type SessionPageContentProps = {
  sessionId?: string;
};

const SessionPageContent: React.FC<SessionPageContentProps> = ({
  sessionId,
}) => {
  const { socket } = usePokerService();

  const usernameLocalStorageKey = `username-${sessionId}`;
  const [username, setUsername] = useState(
    localStorage.getItem(usernameLocalStorageKey)
  );
  const [pokerSession, setPokerSession] = useState<HoldemPokerSession | null>(
    null
  );

  useEffect(() => {
    socket.emit("getSession", { sessionId });

    socket.on("session", (session: HoldemPokerSession) => {
      setPokerSession(session);
    });

    return () => {
      socket.removeAllListeners("session");
    };
  }, [socket, sessionId]);

  const handleSetUsername = (username: string) => {
    setUsername(username);
    localStorage.setItem(usernameLocalStorageKey, username);
  };

  if (!username) {
    return <EnterUsername setUsername={handleSetUsername} />;
  }

  if (!pokerSession) {
    // TODO: style
    return <>Loading...</>;
  }

  return (
    <>
      <div>Welcome {username}!</div>
      <div>
        {pokerSession.currentHand
          ? `Hand ${pokerSession.currentHand.number}`
          : "No active hand at the moment"}
      </div>
    </>
  );
};

export const SessionPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();

  return (
    <Layout>
      <Header>Home Poker Software</Header>
      <Main>
        <SessionPageContent sessionId={sessionId} />
      </Main>
    </Layout>
  );
};
