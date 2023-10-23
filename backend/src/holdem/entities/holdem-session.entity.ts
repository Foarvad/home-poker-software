import {
  Column,
  CreateDateColumn,
  Entity,
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

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  startedAt: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  endedAt: Date | null;

  @OneToMany(() => HoldemHand, (hand) => hand.session)
  hands: HoldemHand[];

  // Надо подумать нужна ли эта колонка
  @OneToOne(() => HoldemHand)
  currentHand: HoldemHand | null;
}
