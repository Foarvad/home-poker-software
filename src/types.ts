// https://www.deceptionary.com/aboutsuits.html
export enum PlayingCardSuit {
  SPADE = 's',
  HEART = 'h',
  CLUB = 'c',
  DIAMOND = 'd',
}

export type PlayingCardRank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K' | 'A';

export type PlayingCard = {
  rank: PlayingCardRank,
  suit: PlayingCardSuit,
}
