import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { HoldemHand } from './holdem-hand.entity';

@Entity()
export class HoldemSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: string;

  @OneToMany(() => HoldemHand, hand => hand.session)
  hands: HoldemHand[];
}