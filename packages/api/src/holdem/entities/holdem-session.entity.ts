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

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  startedAt: Date | null;

  @OneToMany(() => HoldemHand, (hand) => hand.session)
  hands: HoldemHand[];

  @Column({ nullable: true })
  currentHand: HoldemHand | null;
}
