export enum HoldemSessionStatus {
  NOT_STARTED = 'NOT_STARTED',
  ACTIVE = 'ACTIVE',
  ENDED = 'ENDED',
}

export enum HoldemServiceErrorType {
  SESSION_NOT_FOUND,
  INCORRECT_SESSION_STATUS,
  NO_ACTIVE_HAND,
  NO_CURRENT_LEVEL,
  PLAYER_HAND_ALREADY_EXISTS,
  INVALID_FLOP,
  INVALID_TURN_OR_RIVER,
}
