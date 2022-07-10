import { styled } from '@stitches/react';
import React, { useCallback, useState } from 'react';
import { CardImage } from '../../components/CardImage/CardImage';

import { CardSelector } from '../../components/CardSelector';
import { ALL_CARD_SUITS_ORDERED_2X2 } from '../../constants';
import { Hand, PlayingCard, PlayingCardSuit } from '../../types';

const StyledWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
});

const CardSelectorsWrapper = styled('div', {
  display: 'grid',
  gridTemplateRows: 'auto auto',
  gridTemplateColumns: 'auto auto',
  gap: '4px',
});

const CardPreview = styled('div', {

})

const CardPreviewWrapper = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '20px',
  height: '90px',
})

export const HandSelector: React.FC = () => {
  const [firstCard, setFirstCard] = useState<PlayingCard | null>(null);
  const [secondCard, setSecondCard] = useState<PlayingCard | null>(null);

  const handleSelectCard = (card: PlayingCard) => {
    if (!firstCard) {
      setFirstCard(card);
      return;
    }
    if (!secondCard) {
      setSecondCard(card);
    }
  };

  const disabledCards = [firstCard, secondCard].filter((card) => card !== null) as PlayingCard[];

  const isCardSelectorsDisabled = Boolean(firstCard && secondCard);

  return (
    <StyledWrapper>
      <CardPreviewWrapper>
        <CardPreview onClick={() => setFirstCard(null)}>
          <CardImage card={firstCard} />
        </CardPreview>
        <CardPreview onClick={() => setSecondCard(null)}>
          <CardImage card={secondCard} />
        </CardPreview>
      </CardPreviewWrapper>
      <CardSelectorsWrapper>
        {ALL_CARD_SUITS_ORDERED_2X2.map((suit) => (
          <CardSelector suit={suit} disabled={isCardSelectorsDisabled} onSelect={handleSelectCard} key={suit} disabledCards={disabledCards} />
        ))}
      </CardSelectorsWrapper>
    </StyledWrapper>
  )
};
