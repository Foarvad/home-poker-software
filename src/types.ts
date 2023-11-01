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
  currentLevel: number | null;
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
  level: number;
  playerHands: HoldemPlayerHand[];
};

// Player info in specific poker hand

export type HoldemPlayerHand = {
  id: string;
  playerName: string;
  playerHand: string;
};

// 52 Card deck

export enum PlayingCardRank {
  TWO = '2',
  THREE = '3',
  FOUR = '4',
  FIVE = '5',
  SIX = '6',
  SEVEN = '7',
  EIGHT = '8',
  NINE = '9',
  TEN = 'T',
  JACK = 'J',
  QUEEN = 'Q',
  KING = 'K',
  ACE = 'A',
}

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
