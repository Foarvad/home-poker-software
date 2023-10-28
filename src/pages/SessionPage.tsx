import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../components/Button";

import { Layout, Header, Main, CenterWrapper } from "../components/Layout";
import { SessionStatus } from "../components/SessionStatus";
import { EnterUsername } from "../features/EnterUsername";
import { HandSelector } from "../features/HandSelector";
import { useAppConfig } from "../providers/AppConfigProvider";
import { usePokerService } from "../providers/PokerServiceProvider";
import { HoldemPokerSession } from "../types";
import {
  convertLevelToBlinds,
  renderBlindsFromSessionHand,
} from "../utils/convertLevelToBlinds";

type SessionPageContentProps = {
  sessionId: string;
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
    socket.emit("joinSession", { sessionId });

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

  const handleSubmitHand = (hand: string) => {
    socket.emit("addPlayerHand", {
      sessionId,
      hand: { playerName: username, playerHand: hand },
    });
  };

  if (!username) {
    return <EnterUsername setUsername={handleSetUsername} />;
  }

  if (!pokerSession) {
    // TODO: style
    return <>Loading...</>;
  }

  if (
    pokerSession.currentHand &&
    !pokerSession.currentHand.playerHands
      .map(({ playerName }) => playerName)
      .includes(username)
  ) {
    return (
      <>
        <HandSelector handSize={2} onSelect={handleSubmitHand} />
        {renderBlindsFromSessionHand(pokerSession.currentHand)}
      </>
    );
  }

  return (
    <CenterWrapper>
      <SessionStatus pokerSession={pokerSession} />
      {renderBlindsFromSessionHand(pokerSession.currentHand)}
    </CenterWrapper>
  );
};

export const SessionPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();

  const { toggleSneakyCardPreview } = useAppConfig();

  return (
    <Layout>
      <Header>
        <Button onClick={toggleSneakyCardPreview}>
          Toggle card visibility
        </Button>
      </Header>
      <Main>
        {sessionId ? (
          <SessionPageContent sessionId={sessionId} />
        ) : (
          "Session id is not provided"
        )}
      </Main>
    </Layout>
  );
};
