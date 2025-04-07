import { Module } from '@nestjs/common';
import { LobbyService } from './lobby.service';
import { LobbyController } from './lobby.controller';
import { LobbyGateway } from '../gateway/lobby.gateway';

@Module({
  providers: [LobbyService, LobbyGateway],
  controllers: [LobbyController],
  exports: [LobbyService, LobbyGateway],
})
export class LobbyModule {}
