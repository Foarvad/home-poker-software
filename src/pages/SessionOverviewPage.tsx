import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Layout, Header, Main, CenterWrapper } from "../components/Layout";
import { Button } from "../components/Button";
import { usePokerService } from "../providers/PokerServiceProvider";
import { TextInput } from "../components/TextInput";
import { HoldemPlayerHand, HoldemPokerSession } from "../types";
import { styled } from "../stitches.config";
import { CardImage } from "../components/CardImage/CardImage";
import { parseCards } from "../utils/parseCards";

const PlayerHandsWrapper = styled("div", {
  display: "flex",
  justifyContent: "center",
  gap: "32px",
  height: '150px',
});

const PlayerHandWrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
});

const PlayerHandCardsWrapper = styled("div", {
  display: "flex",
  gap: "4px",
});

const PlayerHandCardWrapper = styled("div", {
  width: "50px",
});

export const SessionOverviewPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();

  const [handNumber, setHandNumber] = useState("");

  const { socket } = usePokerService();

  const [pokerSession, setPokerSession] = useState<HoldemPokerSession | null>(
    null
  );
  const [playerHands, setPlayerHands] = useState<HoldemPlayerHand[] | null>(
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
      (response: HoldemPlayerHand[]) => {
        setPlayerHands(response);
      }
    );
  };

  return (
    <Layout>
      <Header>{pokerSession?.name}</Header>
      <Main>
        <PlayerHandsWrapper>
          {playerHands?.map(({ id, playerHand, playerName }) => {
            const parsedPlayerCards = parseCards(playerHand);

            return (
              <PlayerHandWrapper key={id}>
                {playerName}
                <PlayerHandCardsWrapper>
                  {parsedPlayerCards.map((parsedPlayerCard) => (
                    <PlayerHandCardWrapper>
                      <CardImage
                        card={parsedPlayerCard}
                        key={`${parsedPlayerCard.rank}${parsedPlayerCard.suit}`}
                      />
                    </PlayerHandCardWrapper>
                  ))}
                </PlayerHandCardsWrapper>
              </PlayerHandWrapper>
            );
          })}
        </PlayerHandsWrapper>
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
