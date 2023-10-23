import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { HoldemHand } from './holdem-hand.entity';

@Entity()
export class HoldemPlayerHand {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  playerName: string;

  @Column({ type: 'char', length: 4 })
  playerHand: string; // 5hAs

  @ManyToOne(() => HoldemHand)
  hand: HoldemHand;
}
