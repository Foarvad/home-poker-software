import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { HoldemPlayerHand } from './holdem-player-hand.entity';
import { HoldemSession } from './holdem-session.entity';

@Entity()
export class HoldemHand {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'smallint' })
  number: number;

  @Column({ type: 'char', length: 6, nullable: true })
  flop: string | null; // 5hAsQd

  @Column({ type: 'char', length: 2, nullable: true })
  turn: string | null; // Qs

  @Column({ type: 'char', length: 2, nullable: true })
  river: string | null; // Jh

  @Column({ type: 'smallint' })
  level: number;

  @OneToMany(() => HoldemPlayerHand, (playerHand) => playerHand.hand)
  playerHands: HoldemPlayerHand[];

  @ManyToOne(() => HoldemSession, (session) => session.hands)
  session: HoldemSession;
}
