import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { HoldemSession } from './entities/holdem-session.entity';
import { HoldemHand } from './entities/holdem-hand.entity';
import { HoldemBoard } from './entities/holdem-board.entity';
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
    @InjectRepository(HoldemBoard)
    private readonly boardsRepository: Repository<HoldemBoard>,
    @InjectRepository(HoldemPlayerHand)
    private readonly playerHandsRepository: Repository<HoldemPlayerHand>,
  ) { }

  // Helpers

  private async findSessionById(sessionId: string) {
    const session = await this.sessionsRepository.findOne({
      relations: { currentHand: true },
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

  // Main methods

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
        'Could not start session. Session is already started or was ended.',
      );
    }

    await this.dataSource.transaction(async (manager) => {
      // Create first hand
      const firstHand = manager.create(HoldemHand, {
        number: 1,
        session,
      });

      // Save first hand
      await manager.getRepository(HoldemHand).save(firstHand);

      // Update session
      await manager.getRepository(HoldemSession).update(session.id, {
        currentHand: firstHand,
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
        'Could not end session. Session is already ended.',
      );
    }

    await this.sessionsRepository.update(session.id, {
      currentHand: null,
      status: HoldemSessionStatus.ENDED,
      endedAt: new Date(),
    });
  }

  async nextHand(sessionId: string) {
    const session = await this.findSessionById(sessionId);

    if (session.status !== HoldemSessionStatus.ACTIVE) {
      throw new HoldemServiceError(
        HoldemServiceErrorType.INCORRECT_SESSION_STATUS,
        'Could not start a new hand. Session is not active.',
      );
    }

    if (!session.currentHand) {
      throw new HoldemServiceError(
        HoldemServiceErrorType.NO_ACTIVE_HAND,
        'Could not start a new hand. Session is active, but current hand is null.',
      );
    }

    const nextHandNumber = session.currentHand.number + 1;

    await this.dataSource.transaction(async (manager) => {
      // Create new hand
      const newHand = manager.create(HoldemHand, {
        number: nextHandNumber,
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
    const session = await this.findSessionById(sessionId);
    const currentHand = session.currentHand;

    if (!currentHand) {
      throw new HoldemServiceError(
        HoldemServiceErrorType.NO_ACTIVE_HAND,
        'Could not add player hand. Session has no active hand at the moment.',
      );
    }

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
}
