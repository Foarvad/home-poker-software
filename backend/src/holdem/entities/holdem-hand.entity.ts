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

  @Column()
  number: number;

  @Column({ nullable: true })
  flop: string | null; // 5hAsQd

  @Column({ nullable: true })
  turn: string | null; // Qs

  @Column({ nullable: true })
  river: string | null; // Jh

  @OneToMany(() => HoldemPlayerHand, (playerHand) => playerHand.hand)
  playerHands: HoldemPlayerHand[];

  @ManyToOne(() => HoldemSession, (session) => session.hands)
  session: HoldemSession;
}
