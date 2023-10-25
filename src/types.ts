export type User = {
  username: string;
  displayName: string;
};

// Poker session

export enum HoldemSessionStatus {
  NOT_STARTED = 'NOT_STARTED',
  ACTIVE = 'ACTIVE',
  ENDED = 'ENDED',
}

export type HoldemPokerSession = {
  id: string;
  name: string;
  status: HoldemSessionStatus;
  currentHand: HoldemPokerHand | null;
  hands: HoldemPokerHand[];
};

// One hand from the game (with board and player hands info)

export type HoldemPokerHand = {
  id: string;
  number: number;
  flop: string;
  turn: string;
  river: string;
  playerHands: HoldemPlayerHand[];
};

// Player info in specific poker hand

export type HoldemPlayerHand = {
  id: string;
  playerName: string;
  playerHand: string;
};

// 52 Card deck

export type PlayingCardRank =
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | 'T'
  | 'J'
  | 'Q'
  | 'K'
  | 'A';

export enum PlayingCardSuit {
  SPADE = 's',
  HEART = 'h',
  CLUB = 'c',
  DIAMOND = 'd',
}

export type PlayingCard = {
  rank: PlayingCardRank;
  suit: PlayingCardSuit;
};

// Card combinations

export type HoldemBoard = {
  flop: [PlayingCard, PlayingCard, PlayingCard];
  turn: PlayingCard;
  river: PlayingCard;
};
