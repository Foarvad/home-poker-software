import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { HoldemSessionStatus } from '../holdem.types';

import { HoldemHand } from './holdem-hand.entity';

@Entity()
export class HoldemSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'enum', enum: HoldemSessionStatus, default: HoldemSessionStatus.NOT_STARTED })
  status: HoldemSessionStatus;

  @OneToOne(() => HoldemHand, { nullable: true })
  @JoinColumn()
  currentHand: HoldemHand | null;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  startedAt: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  endedAt: Date | null;

  @OneToMany(() => HoldemHand, (hand) => hand.session)
  hands: HoldemHand[];
}
