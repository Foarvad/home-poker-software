import { PlayingCardRank, PlayingCardSuit } from "./types";

export const CARD_RANKS = Object.values(PlayingCardRank);
export const CARD_SUITS = Object.values(PlayingCardSuit);

// https://www.deceptionary.com/aboutsuits.html

export const ALL_CARD_SUITS_ORDERED_SHOCKED = [PlayingCardSuit.SPADE, PlayingCardSuit.HEART, PlayingCardSuit.CLUB, PlayingCardSuit.DIAMOND];
export const ALL_CARD_SUITS_ORDERED_2X2 = [PlayingCardSuit.SPADE, PlayingCardSuit.HEART, PlayingCardSuit.DIAMOND, PlayingCardSuit.CLUB];
