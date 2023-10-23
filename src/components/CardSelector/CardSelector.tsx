import { styled } from "@stitches/react"
import { useMemo, useState } from "react";
import { PlayingCardRank, PlayingCardSuit, PlayingCard } from "../../types";
import { PieMenu } from "../PieMenu";


type CardSelectorProps = {
  suit: PlayingCardSuit;
  disabledCards?: PlayingCard[];
  disabled?: boolean;
  onSelect: (card: PlayingCard) => void;
}

const StyledButton = styled('button', {
  width: '100%',
  height: '100%',
  fontSize: '1.5rem',
  aspectRatio: '1 / 1',
})

const cards: PlayingCardRank[] = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

const cardOptions = cards.map((card) => ({ label: card !== 'T' ? card : '10', value: card }));

export const CardSelector: React.FC<CardSelectorProps> = ({ suit, disabled, disabledCards, onSelect }) => {
  const [isMenuOpened, setMenuOpened] = useState(false);

  const handleTouchStart = () => {
    setMenuOpened(true);
  }

  const handleTouchEnd = () => {
    setMenuOpened(false);
  }

  const handleSelect = (rank: PlayingCardRank) => {
    onSelect({ rank, suit });
  }

  const suitSymbol = useMemo(() => {
    switch (suit) {
      case PlayingCardSuit.SPADE:
        return '♠';
      case PlayingCardSuit.HEART:
        return '♥';
      case PlayingCardSuit.CLUB:
        return '♣';
      case PlayingCardSuit.DIAMOND:
        return '♦';
    }
  }, [suit]);

  const disabledRanks = useMemo(() => disabledCards?.filter((card) => card.suit === suit).map((card) => card.rank) || [], [disabledCards, suit]);

  const filteredCardOptions = useMemo(() => cardOptions.filter((card) => !disabledRanks.includes(card.value)), [cardOptions, disabledRanks]);

  return (
    <PieMenu<PlayingCardRank> opened={isMenuOpened} options={filteredCardOptions} centerSymbol={suitSymbol} disabled={disabled} onSelect={handleSelect} onTouchStart={(handleTouchStart)} onTouchEnd={(handleTouchEnd)}>
      <StyledButton disabled={disabled}>{suitSymbol}</StyledButton>
    </PieMenu>
  )

}