import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { HoldemBoard } from './holdem-board.entity';
import { HoldemPlayerHand } from './holdem-player-hand.entity';
import { HoldemSession } from './holdem-session.entity';

@Entity()
export class HoldemHand {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  number: number;

  @OneToOne(() => HoldemBoard)
  board: HoldemBoard;

  @OneToMany(() => HoldemPlayerHand, (playerHand) => playerHand.hand)
  playerHands: HoldemPlayerHand[];

  @ManyToOne(() => HoldemSession, (session) => session.hands)
  session: HoldemSession;
}
