import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

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
      // We declare entities with camelCase and it will be automatically transformed to snake_case for the database
      namingStrategy: new SnakeNamingStrategy(),
    }),
    HoldemModule,
  ],
})
export class AppModule {}
