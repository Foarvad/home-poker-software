import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Layout, Header, Main } from "../components/Layout";
import { Button } from "../components/Button";
import { usePokerService } from "../providers/PokerServiceProvider";
import { HoldemPokerSession, HoldemSessionStatus } from "../types";
import { styled } from "../stitches.config";
import { SessionStatus } from "../components/SessionStatus";

const ManagerLayout = styled("div", {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gridColumnGap: "32px",
  gridRowGap: "24px",
});

const ManagerItem = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  padding: "16px",
});

const NextHandButton = styled(Button, {
  height: "100%",
});

const SessionStatusWrapper = styled("div", {
  marginBottom: "24px",
});

export const SessionManagerPage: React.FC = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();

  const { socket } = usePokerService();

  const [pokerSession, setPokerSession] = useState<HoldemPokerSession | null>(
    null
  );
  const [flop, setFlop] = useState("");
  const [turn, setTurn] = useState("");
  const [river, setRiver] = useState("");

  useEffect(() => {
    socket.emit("getSession", { sessionId });
    socket.emit("joinSessionAsManager", { sessionId });

    socket.on("session", (session: HoldemPokerSession) => {
      setPokerSession(session);
    });

    return () => {
      socket.removeAllListeners("session");
    };
  }, [socket, sessionId]);

  const handleNextHand = () => {
    socket.emit("nextHand", { sessionId });
    setFlop("");
    setTurn("");
    setRiver("");
  };

  const handleAddFlop = () => {
    socket.emit("addFlop", { sessionId, flop });
  };

  const handleAddTurn = () => {
    socket.emit("addTurn", { sessionId, turn });
  };

  const handleAddRiver = () => {
    socket.emit("addRiver", { sessionId, river });
  };

  const handleStartSession = () => {
    socket.emit("startSession", { sessionId });
  };

  const handleEndSession = () => {
    socket.emit("endSession", { sessionId });
  };

  const renderPlayerHands = (pokerSession: HoldemPokerSession) => {
    if (!pokerSession.currentHand) {
      return "No active hand at the moment";
    }

    if (!pokerSession.currentHand.playerHands.length) {
      return "Waiting for players to add their hands";
    }

    return pokerSession.currentHand.playerHands
      .map((playerHand) => playerHand.playerName)
      .join(", ");
  };

  return (
    <Layout>
      <Header />
      <Main>
        {pokerSession ? (
          <>
            <SessionStatusWrapper>
              <SessionStatus pokerSession={pokerSession} />
            </SessionStatusWrapper>
            <ManagerLayout>
              <ManagerItem style={{ gridColumn: "span 2" }}>
                <div>Player hands:</div>
                <div>{renderPlayerHands(pokerSession)}</div>
              </ManagerItem>
              <ManagerItem>
                <NextHandButton
                  variant="positive"
                  onClick={handleNextHand}
                  disabled={!pokerSession.currentHand}
                >
                  Next hand
                </NextHandButton>
              </ManagerItem>
              <ManagerItem>
                <input
                  type="text"
                  value={pokerSession.currentHand?.flop ?? flop}
                  onChange={(e) => setFlop(e.target.value)}
                  maxLength={6}
                  placeholder="ex: 6sAh3c"
                  disabled={
                    !pokerSession.currentHand ||
                    !!pokerSession.currentHand?.flop
                  }
                ></input>
                <Button
                  onClick={handleAddFlop}
                  disabled={
                    flop.length !== 6 ||
                    !pokerSession.currentHand ||
                    !!pokerSession.currentHand?.flop
                  }
                >
                  Add flop
                </Button>
              </ManagerItem>
              <ManagerItem>
                <input
                  type="text"
                  value={pokerSession.currentHand?.turn ?? turn}
                  onChange={(e) => setTurn(e.target.value)}
                  maxLength={2}
                  placeholder="ex: Kc"
                  disabled={
                    !pokerSession.currentHand ||
                    !!pokerSession.currentHand?.turn
                  }
                ></input>
                <Button
                  onClick={handleAddTurn}
                  disabled={
                    turn.length !== 2 ||
                    !pokerSession.currentHand ||
                    !!pokerSession.currentHand?.turn
                  }
                >
                  Add turn
                </Button>
              </ManagerItem>
              <ManagerItem>
                <input
                  type="text"
                  value={pokerSession.currentHand?.river ?? river}
                  onChange={(e) => setRiver(e.target.value)}
                  maxLength={2}
                  placeholder="ex: 6s"
                  disabled={
                    !pokerSession.currentHand ||
                    !!pokerSession.currentHand?.river
                  }
                ></input>
                <Button
                  onClick={handleAddRiver}
                  disabled={
                    river.length !== 2 ||
                    !pokerSession.currentHand ||
                    !!pokerSession.currentHand?.river
                  }
                >
                  Add river
                </Button>
              </ManagerItem>
              <ManagerItem>
                <Button
                  onClick={handleStartSession}
                  disabled={
                    pokerSession.status !== HoldemSessionStatus.NOT_STARTED
                  }
                >
                  Start session
                </Button>
              </ManagerItem>
              <ManagerItem>
                <Button
                  variant="critical"
                  onClick={handleEndSession}
                  disabled={pokerSession.status !== HoldemSessionStatus.ACTIVE}
                >
                  End session
                </Button>
              </ManagerItem>
            </ManagerLayout>
          </>
        ) : (
          "Loading..."
        )}
      </Main>
    </Layout>
  );
};
