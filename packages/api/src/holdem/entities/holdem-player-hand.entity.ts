import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { HoldemHand } from './holdem-hand.entity';

@Entity()
export class HoldemPlayerHand {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  playerName: string;

  @Column()
  playerHand: string; // 5hAs

  @ManyToOne(() => HoldemHand)
  hand: HoldemHand;
}
