import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { HoldemHand } from './holdem-hand.entity';

@Entity()
export class HoldemSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  currentHandNumber: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  startedAt: Date;

  @OneToMany(() => HoldemHand, (hand) => hand.session)
  hands: HoldemHand[];
}
