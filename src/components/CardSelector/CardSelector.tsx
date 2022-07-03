import { styled } from "@stitches/react"
import { useMemo, useState } from "react";
import { PlayingCardRank, PlayingCardSuit, PlayingCard } from "../../types";
import { PieMenu } from "../PieMenu";


type CardSelectorProps = {
  suit: PlayingCardSuit;
  onSelect: (card: PlayingCard) => void;
}

const StyledButton = styled('button', {
  width: 'min(15vw, 15vh)',
  height: 'min(15vw, 15vh)',
  fontSize: '1.5rem',
})

const cards: PlayingCardRank[] = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

const cardOptions = cards.map((card) => ({ label: card !== 'T' ? card : '10', value: card }));

export const CardSelector: React.FC<CardSelectorProps> = ({ suit, onSelect }) => {
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
  }, [suit])

  return (
    <PieMenu<PlayingCardRank> opened={isMenuOpened} options={cardOptions} centerSymbol={suitSymbol} onSelect={handleSelect} onTouchStart={(handleTouchStart)} onTouchEnd={(handleTouchEnd)}>
      <StyledButton>{suitSymbol}</StyledButton>
    </PieMenu>
  )

}