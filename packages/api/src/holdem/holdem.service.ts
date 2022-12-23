import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { HoldemSession } from './entities/holdem-session.entity';
import { HoldemHand } from './entities/holdem-hand.entity';
import { HoldemBoard } from './entities/holdem-board.entity';
import { HoldemPlayerHand } from './entities/holdem-player-hand.entity';
import { CreateSessionDto } from './dto/create-session-dto';

@Injectable()
export class HoldemService {
  constructor(
    @InjectRepository(HoldemSession)
    private readonly sessionsRepository: Repository<HoldemSession>,
    @InjectRepository(HoldemHand)
    private readonly handsRepository: Repository<HoldemHand>,
    @InjectRepository(HoldemBoard)
    private readonly boardsRepository: Repository<HoldemBoard>,
    @InjectRepository(HoldemPlayerHand)
    private readonly playerHandsRepository: Repository<HoldemPlayerHand>,
  ) {}

  async createSession(createSessionDto: CreateSessionDto): Promise<HoldemSession> {
    const session = new HoldemSession();
    session.name = createSessionDto.name;

    return this.sessionsRepository.save(session);
  }
}