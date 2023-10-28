import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { styled } from "../stitches.config";
import { Layout, Header, Main } from "../components/Layout";
import { Button } from "../components/Button";
import { usePokerService } from "../providers/PokerServiceProvider";
import { HoldemPokerSession, HoldemSessionStatus } from "../types";
import { SessionStatus } from "../components/SessionStatus";
import { TextInput } from "../components/TextInput";
import { convertLevelToBlinds } from "../utils/convertLevelToBlinds";

const ManagerLayout = styled("div", {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gridColumnGap: "32px",
  gridRowGap: "24px",
});

const ManagerItem = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  padding: "16px",
  justifyContent: "center",
  alignItems: "center",
});

const NextHandButton = styled(Button, {
  height: "100%",
});

const SessionStatusWrapper = styled("div", {
  marginBottom: "24px",
});

const LevelControlWrapper = styled("div", {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
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
      socket.emit("leaveSessionAsManager", { sessionId });
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

  const handlePreviousLevel = () => {
    socket.emit("previousLevel", { sessionId });
  };

  const handleNextLevel = () => {
    socket.emit("nextLevel", { sessionId });
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
      <Header>
        <Button onClick={() => navigate(`/sessions/${sessionId}/qr`)}>
          Show QR
        </Button>
      </Header>
      <Main>
        {pokerSession ? (
          <>
            <SessionStatusWrapper>
              <SessionStatus pokerSession={pokerSession} />
            </SessionStatusWrapper>
            <ManagerLayout>
              <ManagerItem style={{ gridColumn: "span 3" }}>
                <div>Player hands:</div>
                <div>{renderPlayerHands(pokerSession)}</div>
              </ManagerItem>
              <ManagerItem>
                <NextHandButton
                  variant="positive"
                  onClick={handleNextHand}
                  fullWidth
                  disabled={!pokerSession.currentHand}
                >
                  Next hand
                </NextHandButton>
              </ManagerItem>
              <ManagerItem>
                <LevelControlWrapper>
                  <Button
                    evenPaddings
                    onClick={handlePreviousLevel}
                    disabled={
                      pokerSession.status !== HoldemSessionStatus.ACTIVE
                    }
                  >
                    {"<"}
                  </Button>
                  {`Level ${pokerSession.currentLevel ?? 0}`}
                  <Button
                    evenPaddings
                    onClick={handleNextLevel}
                    disabled={
                      pokerSession.status !== HoldemSessionStatus.ACTIVE
                    }
                  >
                    {">"}
                  </Button>
                </LevelControlWrapper>
              </ManagerItem>
              <ManagerItem>{`Blinds: ${convertLevelToBlinds(
                pokerSession.currentLevel
              )}`}</ManagerItem>
              <ManagerItem>
                <TextInput
                  type="text"
                  value={pokerSession.currentHand?.flop ?? flop}
                  onChange={(e) => setFlop(e.target.value)}
                  maxLength={6}
                  placeholder="ex: 6sAh3c"
                  disabled={
                    !pokerSession.currentHand ||
                    !!pokerSession.currentHand?.flop
                  }
                ></TextInput>
                <Button
                  onClick={handleAddFlop}
                  fullWidth
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
                <TextInput
                  type="text"
                  value={pokerSession.currentHand?.turn ?? turn}
                  onChange={(e) => setTurn(e.target.value)}
                  maxLength={2}
                  placeholder="ex: Kc"
                  disabled={
                    !pokerSession.currentHand ||
                    !!pokerSession.currentHand?.turn
                  }
                ></TextInput>
                <Button
                  onClick={handleAddTurn}
                  fullWidth
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
                <TextInput
                  type="text"
                  value={pokerSession.currentHand?.river ?? river}
                  onChange={(e) => setRiver(e.target.value)}
                  maxLength={2}
                  placeholder="ex: 6s"
                  disabled={
                    !pokerSession.currentHand ||
                    !!pokerSession.currentHand?.river
                  }
                ></TextInput>
                <Button
                  onClick={handleAddRiver}
                  fullWidth
                  disabled={
                    river.length !== 2 ||
                    !pokerSession.currentHand ||
                    !!pokerSession.currentHand?.river
                  }
                >
                  Add river
                </Button>
              </ManagerItem>
              <ManagerItem></ManagerItem>
              <ManagerItem>
                <Button
                  onClick={handleStartSession}
                  fullWidth
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
                  fullWidth
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
