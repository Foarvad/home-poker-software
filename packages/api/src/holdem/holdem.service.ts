import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { HoldemSession } from './entities/holdem-session.entity';
import { HoldemHand } from './entities/holdem-hand.entity';
import { HoldemBoard } from './entities/holdem-board.entity';
import { HoldemPlayerHand } from './entities/holdem-player-hand.entity';
import { CreateSessionDto } from './dto/create-session-dto';

export enum HoldemServiceErrorType {
  SESSION_NOT_FOUND,
  SESSION_ALREADY_STARTED,
  SESSION_NOT_STARTED,
  PLAYER_HAND_ALREADY_EXISTS,
}

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
  ) {}

  // Helpers

  private async findSessionById(sessionId: string) {
    const session = await this.sessionsRepository.findOne({
      relations: { currentHand: true },
      where: { id: sessionId },
    });

    if (!session) {
      throw new HoldemServiceError(
        HoldemServiceErrorType.SESSION_NOT_FOUND,
        'Session not found',
      );
    }

    return session;
  }

  // Main methods

  async createSession(
    createSessionDto: CreateSessionDto,
  ): Promise<HoldemSession> {
    const session = new HoldemSession();
    session.name = createSessionDto.name;

    return this.sessionsRepository.save(session);
  }

  async startSession(sessionId: string) {
    const session = await this.findSessionById(sessionId);

    if (session.currentHand !== null && session.startedAt) {
      throw new HoldemServiceError(
        HoldemServiceErrorType.SESSION_ALREADY_STARTED,
        'Session already started',
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
        startedAt: new Date(),
      });
    });
  }

  async nextHand(sessionId: string) {
    const session = await this.findSessionById(sessionId);

    if (session.currentHand === null || !session.startedAt) {
      throw new HoldemServiceError(
        HoldemServiceErrorType.SESSION_NOT_STARTED,
        'Session not started',
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
}
