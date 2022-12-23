import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { HoldemHand } from './holdem-hand.entity';

@Entity()
export class HoldemBoard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  flop: string; // 5hAsQd

  @Column()
  turn: string; // 5hAsQd

  @Column()
  river: string; // 5hAsQd

  @OneToOne(() => HoldemHand)
  hand: HoldemHand;
}
