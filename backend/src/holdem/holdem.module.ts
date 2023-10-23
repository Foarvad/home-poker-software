import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HoldemSession } from './entities/holdem-session.entity';
import { HoldemHand } from './entities/holdem-hand.entity';
import { HoldemPlayerHand } from './entities/holdem-player-hand.entity';

import { HoldemService } from './holdem.service';
import { HoldemGateway } from './holdem.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([HoldemSession, HoldemHand, HoldemPlayerHand]),
  ],
  providers: [HoldemService, HoldemGateway],
})
export class HoldemModule {}
