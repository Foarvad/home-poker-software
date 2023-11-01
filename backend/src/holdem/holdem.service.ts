import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, Repository } from 'typeorm';

import { HoldemSession } from './entities/holdem-session.entity';
import { HoldemHand } from './entities/holdem-hand.entity';
import { HoldemPlayerHand } from './entities/holdem-player-hand.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { AddPlayerHandDto } from './dto/add-player-hand.dto';
import { HoldemServiceErrorType, HoldemSessionStatus } from './holdem.types';

export class HoldemServiceError extends Error {
  constructor(type: HoldemServiceErrorType, message: string) {
    super(message);
    this.name = 'HoldemServiceError';
    this.type = type;
  }

  public type: HoldemServiceErrorType;
}

@Injectable()
export class HoldemService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(HoldemSession)
    private readonly sessionsRepository: Repository<HoldemSession>,
    @InjectRepository(HoldemHand)
    private readonly handsRepository: Repository<HoldemHand>,
    @InjectRepository(HoldemPlayerHand)
    private readonly playerHandsRepository: Repository<HoldemPlayerHand>,
  ) { }

  // Helpers

  private async findSessionById(sessionId: string) {
    const session = await this.sessionsRepository.findOne({
      relations: ['currentHand', 'currentHand.playerHands'],
      where: { id: sessionId },
    });

    if (!session) {
      throw new HoldemServiceError(
        HoldemServiceErrorType.SESSION_NOT_FOUND,
        'Session not found.',
      );
    }

    return session;
  }

  private async findHandByNumber(sessionId: string, handNumber: number) {
    const hand = await this.handsRepository.findOne({
      relations: ['playerHands'],
      where: { session: { id: sessionId }, number: handNumber }
    })

    if (!hand) {
      throw new HoldemServiceError(
        HoldemServiceErrorType.HAND_NOT_FOUND,
        'Hand not found.',
      );
    }

    return hand;
  }

  private async findCurrentHandBySessionId(sessionId: string) {
    const session = await this.findSessionById(sessionId);

    if (!session.currentHand) {
      throw new HoldemServiceError(
        HoldemServiceErrorType.NO_ACTIVE_HAND,
        'Session has no active hand at the moment.',
      );
    }

    return session.currentHand;
  }

  // Main methods

  async getSessions(): Promise<HoldemSession[]> {
    // return this.sessionsRepository.findBy({ status: Not(HoldemSessionStatus.ENDED) });
    return this.sessionsRepository.find();
  }

  async getSessionById(sessionId: string): Promise<HoldemSession> {
    return this.findSessionById(sessionId);
  }

  async createSession(
    createSessionDto: CreateSessionDto,
  ): Promise<HoldemSession> {
    const session = this.sessionsRepository.create({
      name: createSessionDto.name,
      status: HoldemSessionStatus.NOT_STARTED,
    });

    return this.sessionsRepository.save(session);
  }

  async startSession(sessionId: string) {
    const session = await this.findSessionById(sessionId);

    if (session.status !== HoldemSessionStatus.NOT_STARTED) {
      throw new HoldemServiceError(
        HoldemServiceErrorType.INCORRECT_SESSION_STATUS,
        'Session is already started or was ended.',
      );
    }

    await this.dataSource.transaction(async (manager) => {
      // Create first hand
      const firstHand = manager.create(HoldemHand, {
        number: 1,
        level: 1,
        session,
      });

      // Save first hand
      await manager.getRepository(HoldemHand).save(firstHand);

      // Update session
      await manager.getRepository(HoldemSession).update(session.id, {
        currentHand: firstHand,
        currentLevel: 1,
        status: HoldemSessionStatus.ACTIVE,
        startedAt: new Date(),
      });
    });
  }

  async endSession(sessionId: string) {
    const session = await this.findSessionById(sessionId);

    if (session.status === HoldemSessionStatus.ENDED) {
      throw new HoldemServiceError(
        HoldemServiceErrorType.INCORRECT_SESSION_STATUS,
        'Session is already ended.',
      );
    }

    await this.sessionsRepository.update(session.id, {
      currentHand: null,
      currentLevel: null,
      status: HoldemSessionStatus.ENDED,
      endedAt: new Date(),
    });
  }

  async nextHand(sessionId: string) {
    const session = await this.findSessionById(sessionId);

    if (session.status !== HoldemSessionStatus.ACTIVE) {
      throw new HoldemServiceError(
        HoldemServiceErrorType.INCORRECT_SESSION_STATUS,
        'Session is not active.',
      );
    }

    if (!session.currentHand) {
      throw new HoldemServiceError(
        HoldemServiceErrorType.NO_ACTIVE_HAND,
        'Session is active, but current hand is null.',
      );
    }

    if (!session.currentLevel) {
      throw new HoldemServiceError(
        HoldemServiceErrorType.NO_CURRENT_LEVEL,
        'Session is active, but current level is null.',
      );
    }

    const nextHandNumber = session.currentHand.number + 1;
    const currentLevel = session.currentLevel;

    await this.dataSource.transaction(async (manager) => {
      // Create new hand
      const newHand = manager.create(HoldemHand, {
        number: nextHandNumber,
        level: currentLevel,
        session,
      });

      // Save new hand
      await manager.getRepository(HoldemHand).save(newHand);

      // Update session
      await manager.getRepository(HoldemSession).update(session.id, {
        currentHand: newHand,
      });
    });
  }

  async addPlayerHand(sessionId: string, addPlayerHandDto: AddPlayerHandDto) {
    const currentHand = await this.findCurrentHandBySessionId(sessionId);

    const existingPlayerHand = await this.playerHandsRepository.findOne({
      where: {
        playerName: addPlayerHandDto.playerName,
        hand: { id: currentHand.id },
      },
    });

    if (existingPlayerHand) {
      throw new HoldemServiceError(
        HoldemServiceErrorType.PLAYER_HAND_ALREADY_EXISTS,
        `Could not add player hand. This player's hand was already submitted.`,
      );
    }

    const playerHand = this.playerHandsRepository.create({
      playerName: addPlayerHandDto.playerName,
      playerHand: addPlayerHandDto.playerHand,
      hand: currentHand,
    });

    await this.playerHandsRepository.save(playerHand);
  }

  async addFlop(sessionId: string, flop: string) {
    const currentHand = await this.findCurrentHandBySessionId(sessionId);

    if (flop.length !== 6) {
      throw new HoldemServiceError(
        HoldemServiceErrorType.INVALID_FLOP,
        'Invalid flop. It should be in "5hAsQd" format (6 chars long).',
      );
    }

    await this.handsRepository.update(currentHand.id, { flop });
  }

  async addTurn(sessionId: string, turn: string) {
    const currentHand = await this.findCurrentHandBySessionId(sessionId);

    if (turn.length !== 2) {
      throw new HoldemServiceError(
        HoldemServiceErrorType.INVALID_TURN_OR_RIVER,
        'Invalid turn. It should be in "Qd" format (2 chars long).',
      );
    }

    await this.handsRepository.update(currentHand.id, { turn });
  }

  async addRiver(sessionId: string, river: string) {
    const currentHand = await this.findCurrentHandBySessionId(sessionId);

    if (river.length !== 2) {
      throw new HoldemServiceError(
        HoldemServiceErrorType.INVALID_TURN_OR_RIVER,
        'Invalid river. It should be in "Qd" format (2 chars long).',
      );
    }

    await this.handsRepository.update(currentHand.id, { river });
  }

  async nextLevel(sessionId: string) {
    const session = await this.findSessionById(sessionId);

    if (!session.currentLevel) {
      throw new HoldemServiceError(
        HoldemServiceErrorType.NO_CURRENT_LEVEL,
        'Current level is null.',
      );
    }

    const nextLevel = Math.min(session.currentLevel + 1, 16);

    await this.sessionsRepository.update(session.id, { currentLevel: nextLevel });
  }

  async previousLevel(sessionId: string) {
    const session = await this.findSessionById(sessionId);

    if (!session.currentLevel) {
      throw new HoldemServiceError(
        HoldemServiceErrorType.NO_CURRENT_LEVEL,
        'Current level is null.',
      );
    }

    const previousLevel = Math.max(session.currentLevel - 1, 1);

    await this.sessionsRepository.update(session.id, { currentLevel: previousLevel });
  }

  async getHandByNumber(sessionId: string, handNumber: number) {
    const hand = await this.findHandByNumber(sessionId, handNumber);

    return hand;
  }
}
