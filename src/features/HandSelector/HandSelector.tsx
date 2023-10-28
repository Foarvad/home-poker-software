import { styled } from "@stitches/react";
import React, { useEffect, useState } from "react";
import { Button } from "../../components/Button";

import { CardImage } from "../../components/CardImage/CardImage";
import { CardSelector } from "../../components/CardSelector";
import { ALL_CARD_SUITS_ORDERED_2X2 } from "../../constants";
import { useAppConfig } from "../../providers/AppConfigProvider";
import { HoldemPlayerHand, PlayingCard } from "../../types";

const StyledWrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  placeItems: "center",
  gap: "32px",
  width: "200px",
});

const CardSelectorsWrapper = styled("div", {
  display: "grid",
  gridTemplateColumns: "calc(50% - 8px) calc(50% - 8px)",
  gridTemplateRows: "1fr 1fr",
  gap: "16px",
  width: "100%",
});

const CardPreview = styled("div", {
  height: "100%",
  display: "flex",
  flex: 1,
  alignItems: "center",
});

const CardPreviewWrapper = styled("div", {
  display: "flex",
  width: "100%",
  placeItems: "center",
  gap: "4px",
  height: "40%",

  variants: {
    sneaky: {
      true: {
        opacity: 0.05,
        filter: "grayscale(1)",
      },
    },
  },
});

type HandSelectorProps = {
  handSize: number;
  onSelect: (hand: string) => void;
};

// TODO: implement hand size logic
export const HandSelector: React.FC<HandSelectorProps> = ({
  handSize,
  onSelect,
}) => {
  const [firstCard, setFirstCard] = useState<PlayingCard | null>(null);
  const [secondCard, setSecondCard] = useState<PlayingCard | null>(null);

  const { isSneakyCardPreview } = useAppConfig();

  const handleSelectCard = (card: PlayingCard) => {
    if (!firstCard) {
      setFirstCard(card);
      return;
    }
    if (!secondCard) {
      setSecondCard(card);
    }
  };

  const disabledCards = [firstCard, secondCard].filter(
    (card) => card !== null
  ) as PlayingCard[];

  const isCardSelectorsDisabled = Boolean(firstCard && secondCard);

  const handleSubmit = () => {
    if (firstCard && secondCard) {
      const hand = `${firstCard.rank}${firstCard.suit}${secondCard.rank}${secondCard.suit}`;
      onSelect(hand);
    }
  };

  return (
    <StyledWrapper>
      <CardPreviewWrapper sneaky={isSneakyCardPreview}>
        <CardPreview
          style={{ justifyContent: "flex-end" }}
          onClick={() => setFirstCard(null)}
        >
          <CardImage card={firstCard} />
        </CardPreview>
        <CardPreview onClick={() => setSecondCard(null)}>
          <CardImage card={secondCard} />
        </CardPreview>
      </CardPreviewWrapper>
      <CardSelectorsWrapper>
        {ALL_CARD_SUITS_ORDERED_2X2.map((suit) => (
          <CardSelector
            suit={suit}
            disabled={isCardSelectorsDisabled}
            onSelect={handleSelectCard}
            key={suit}
            disabledCards={disabledCards}
          />
        ))}
      </CardSelectorsWrapper>
      <Button
        disabled={!firstCard || !secondCard}
        onClick={handleSubmit}
        fullWidth
      >
        Submit hand
      </Button>
    </StyledWrapper>
  );
};
