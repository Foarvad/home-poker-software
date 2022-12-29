import { Injectable } from '@nestjs/common';
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
  ) { }

  async createSession(createSessionDto: CreateSessionDto): Promise<HoldemSession> {
    const session = new HoldemSession();
    session.name = createSessionDto.name;

    return this.sessionsRepository.save(session);
  }

  async startSession(sessionId: string) {
    const session = await this.sessionsRepository.findOneBy({ id: sessionId });

    if (!session) {
      // TODO: Error, session not found
      return;
    }

    await this.dataSource.transaction(async manager => {
      // Create first hand
      const hand = manager.create(HoldemHand, {
        session,
        number: 1,
      })
      await manager.save(hand);
      // Update existing session
      await manager.update(HoldemSession, session, { currentHandNumber: 1, startedAt: new Date() })
    });
  }
}