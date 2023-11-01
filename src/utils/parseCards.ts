import { CARD_RANKS, CARD_SUITS } from "../constants";
import { PlayingCard } from "../types";

export const parseCards = (cards: string): PlayingCard[] => {
  if (cards.length % 2 !== 0) {
    throw new Error('Cards string length should be even');
  }

  // ["Ah", "3s", ...]
  const cardStrings = cards.match(/.{1,2}/g);

  const playingCards: PlayingCard[] = [];

  cardStrings?.forEach((cardString) => {
    const cardRank = CARD_RANKS.find((rank) => rank === cardString[0]);
    const cardSuit = CARD_SUITS.find((suit) => suit === cardString[1]);

    if (cardRank && cardSuit) {
      playingCards.push({
        rank: cardRank,
        suit: cardSuit,
      })
    }
  })

  return playingCards;
}