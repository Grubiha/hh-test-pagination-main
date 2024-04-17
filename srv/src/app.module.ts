import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';

// const pg = new URL(process.env.APP_PG_URL);

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'test_hh_16_04',
      ssl: false,
      autoLoadEntities: true,
      // it is unsafe to use synchronize: true for schema synchronization on production
      synchronize: true, // process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development',
      useUTC: true,
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
