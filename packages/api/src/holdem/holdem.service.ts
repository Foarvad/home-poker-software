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
    const session = await this.sessionsRepository.findOne({
      relations: { currentHand: true },
      where: { id: sessionId },
    });

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

    if (session.currentHand !== null && session.startedAt) {
      throw new HttpException(
        'Session is already started',
        HttpStatus.BAD_REQUEST,
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
      throw new HttpException('Session is not started', HttpStatus.BAD_REQUEST);
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
