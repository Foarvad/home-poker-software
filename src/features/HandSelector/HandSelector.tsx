import { styled } from '@stitches/react';
import React, { useEffect, useState } from 'react';

import { CardImage } from '../../components/CardImage/CardImage';
import { CardSelector } from '../../components/CardSelector';
import { ALL_CARD_SUITS_ORDERED_2X2 } from '../../constants';
import { useApi } from '../../services/api';
import { HoldemPlayerHand, PlayingCard } from '../../types';

const StyledWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  placeItems: 'center',
  gap: '32px',
  width: '35vw',
  height: '100%',
  margin: 'auto',
  backgroundColor: 'DarkRed',
});

const CardSelectorsWrapper = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'calc(50% - 8px) calc(50% - 8px)',
  gridTemplateRows: '1fr 1fr',
  gap: '16px',
  width: '100%',
});

const CardPreview = styled('div', {
  height: '100%',
  display: 'flex',
  flex: 1,
  alignItems: 'center',
})

const CardPreviewWrapper = styled('div', {
  backgroundColor: 'red',
  display: 'flex',
  width: '100%',
  placeItems: 'center',
  gap: '4px',
  height: '40%',
})

export const HandSelector: React.FC = () => {
  const [firstCard, setFirstCard] = useState<PlayingCard | null>(null);
  const [secondCard, setSecondCard] = useState<PlayingCard | null>(null);

  const {send} = useApi();

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

  useEffect(() => {
    if (firstCard && secondCard) {
      const holdemPlayerHand: HoldemPlayerHand = [firstCard, secondCard];

      console.log(holdemPlayerHand);

      // send({
      //   type: 'test',
      //   payload: {
      //     message: `${firstCard.rank}${firstCard.suit} ${secondCard.rank}${secondCard.suit}`,
      //   }
      // })
    }
  }, [firstCard, secondCard])

  return (
    <StyledWrapper>
      <CardPreviewWrapper>
        <CardPreview style={{justifyContent: 'flex-end'}} onClick={() => setFirstCard(null)}>
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
