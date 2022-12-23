import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HoldemSession } from './entities/holdem-session.entity';
import { HoldemHand } from './entities/holdem-hand.entity';
import { HoldemBoard } from './entities/holdem-board.entity';
import { HoldemPlayerHand } from './entities/holdem-player-hand.entity';

import { HoldemService } from './holdem.service';

@Module({
  imports: [TypeOrmModule.forFeature([HoldemSession, HoldemHand, HoldemBoard, HoldemPlayerHand])],
  providers: [HoldemService],
})
export class HoldemModel {

}