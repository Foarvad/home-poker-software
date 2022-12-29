import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { HoldemSession } from './entities/holdem-session.entity';
import { HoldemHand } from './entities/holdem-hand.entity';
import { HoldemBoard } from './entities/holdem-board.entity';
import { HoldemPlayerHand } from './entities/holdem-player-hand.entity';
import { CreateSessionDto } from './dto/create-session-dto';

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
    const session = await this.sessionsRepository.findOneBy({ id: sessionId });

    if (!session) {
      throw new HttpException('Session is not found', HttpStatus.NOT_FOUND);
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

    if (session.currentHandNumber !== null && session.startedAt) {
      throw new HttpException(
        'Session is already started',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.dataSource.transaction(async (manager) => {
      // Create first hand
      const hand = manager.create(HoldemHand, {
        session,
        number: 1,
      });

      // Save first hand
      await manager.getRepository(HoldemHand).save(hand);

      // Update session
      await manager.getRepository(HoldemSession).update(session.id, {
        currentHandNumber: 1,
        startedAt: new Date(),
      });
    });
  }

  async nextHand(sessionId: string) {
    const session = await this.findSessionById(sessionId);

    if (session.currentHandNumber === null || !session.startedAt) {
      throw new HttpException('Session is not started', HttpStatus.BAD_REQUEST);
    }

    const nextHandNumber = session.currentHandNumber + 1;

    await this.dataSource.transaction(async (manager) => {
      // Create next hand
      const hand = manager.create(HoldemHand, {
        session,
        number: nextHandNumber,
      });

      // Save next hand
      await manager.getRepository(HoldemHand).save(hand);

      // Update session
      await manager.getRepository(HoldemSession).update(session.id, {
        currentHandNumber: nextHandNumber,
      });
    });
  }
}
