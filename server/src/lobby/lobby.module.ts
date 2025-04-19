import { Module } from '@nestjs/common';
import { LobbyService } from './lobby.service';
import { LobbyController } from './lobby.controller';
import { LobbyGateway } from '../gateway/lobby.gateway';
import { RoleActionService } from './roleAction.service';
@Module({
  providers: [LobbyService, LobbyGateway, RoleActionService],
  controllers: [LobbyController],
  exports: [LobbyService, LobbyGateway, RoleActionService],
})
export class LobbyModule {}
