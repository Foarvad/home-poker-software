import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Layout, Header, Main, CenterWrapper } from "../components/Layout";
import { Button } from "../components/Button";
import { usePokerService } from "../providers/PokerServiceProvider";
import { TextInput } from "../components/TextInput";
import { HoldemPlayerHand, HoldemPokerSession } from "../types";

export const SessionOverviewPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();

  const [handNumber, setHandNumber] = useState("");

  const { socket } = usePokerService();

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

  const handleGetHands = () => {
    socket.emit(
      "getPlayerHands",
      { sessionId, handNumber: Number(handNumber) },
      (playerHands: HoldemPlayerHand[]) => {
        console.log(playerHands);
      }
    );
  };

  return (
    <Layout>
      <Header>{pokerSession?.name}</Header>
      <Main>
        <CenterWrapper>
          <TextInput
            label="Hand number"
            type="text"
            value={handNumber}
            onChange={(e) => {
              if (!isNaN(Number(e.target.value))) {
                setHandNumber(e.target.value);
              }
            }}
            fullWidth
          ></TextInput>
          <Button onClick={handleGetHands} disabled={!handNumber} fullWidth>
            Get hands
          </Button>
        </CenterWrapper>
      </Main>
    </Layout>
  );
};
