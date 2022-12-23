import React, { useEffect, useState } from "react";
import { PlayingCard } from "../../types"

type CardImageProps = {
  card?: PlayingCard | null;
}

export const CardImage: React.FC<CardImageProps> = ({ card }) => {
  const cardName = card ? `${card.rank}${card.suit}` : 'back_red';

  const [cardUrl, setCardUrl] = useState<string>();

  useEffect(() => {
    import(`./cards/${cardName}.svg`).then((res) => {
      setCardUrl(res.default);
    })
  }, [card]);
  
  return <img height="100%" src={cardUrl} />
}