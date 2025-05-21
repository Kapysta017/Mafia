import { Module } from '@nestjs/common';
import { LobbyModule } from './lobby/lobby.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [LobbyModule, DatabaseModule, AuthModule],
})
export class AppModule {}
