import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HoldemModule } from './holdem/holdem.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgrespw',
      database: 'poker',
      autoLoadEntities: true,
      synchronize: true,
    }),
    HoldemModule,
  ],
})
export class AppModule {}
