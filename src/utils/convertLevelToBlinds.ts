import { HoldemPokerHand, HoldemPokerSession } from "../types";

const blindLevels = [
  {
    level: 1,
    durationMin: 15,
    smallBlind: 25,
    bigBlind: 50,
  },
  {
    level: 2,
    durationMin: 15,
    smallBlind: 50,
    bigBlind: 100,
  },
  {
    level: 3,
    durationMin: 15,
    smallBlind: 75,
    bigBlind: 150,
  },
  {
    level: 4,
    durationMin: 15,
    smallBlind: 100,
    bigBlind: 200,
  },
  {
    level: 5,
    durationMin: 15,
    smallBlind: 200,
    bigBlind: 400,
  },
  {
    level: 6,
    durationMin: 15,
    smallBlind: 300,
    bigBlind: 600,
  },
  {
    level: 7,
    durationMin: 15,
    smallBlind: 400,
    bigBlind: 800,
  },
  {
    level: 8,
    durationMin: 15,
    smallBlind: 500,
    bigBlind: 1000,
  },
  {
    level: 9,
    durationMin: 15,
    smallBlind: 700,
    bigBlind: 1400,
  },
  {
    level: 10,
    durationMin: 15,
    smallBlind: 800,
    bigBlind: 1600,
  },
  {
    level: 11,
    durationMin: 15,
    smallBlind: 1000,
    bigBlind: 2000,
  },
  {
    level: 12,
    durationMin: 15,
    smallBlind: 1500,
    bigBlind: 3000,
  },
  {
    level: 13,
    durationMin: 15,
    smallBlind: 2000,
    bigBlind: 4000,
  },
  {
    level: 14,
    durationMin: 15,
    smallBlind: 3000,
    bigBlind: 6000,
  },
  {
    level: 15,
    durationMin: 15,
    smallBlind: 4000,
    bigBlind: 8000,
  },
  {
    level: 16,
    durationMin: 15,
    smallBlind: 5000,
    bigBlind: 10000,
  },
]

export const convertLevelToBlinds = (level: number | null): string => {
  const levelInfo = blindLevels.find((blindLevel) => blindLevel.level === level);

  return levelInfo ? `${levelInfo.smallBlind}/${levelInfo.bigBlind}` : 'N/A';
}

export const renderBlindsFromSessionHand = (pokerSessionHand: HoldemPokerHand | null) => {
  return pokerSessionHand ?
    `Blinds: ${convertLevelToBlinds(
      pokerSessionHand.level
    )}` : null
}
