import { styled } from '@stitches/react';

import { CardSelector } from '../../components/CardSelector';
import { PlayingCard, PlayingCardSuit } from '../../types';

const StyledWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
});

export const HandSelector = () => {
  const handleSelectCard = (card: PlayingCard) => {
    alert(`${card.rank}${card.suit}`);
  }

  return (
    <StyledWrapper>
      <div>
        <CardSelector suit={PlayingCardSuit.SPADE} onSelect={handleSelectCard} />
        <CardSelector suit={PlayingCardSuit.HEART} onSelect={handleSelectCard} />
      </div>
      <div>
        <CardSelector suit={PlayingCardSuit.CLUB} onSelect={handleSelectCard} />
        <CardSelector suit={PlayingCardSuit.DIAMOND} onSelect={handleSelectCard} />
      </div>
    </StyledWrapper>
  )
};
