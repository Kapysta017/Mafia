import { Controller, Post, Get, Body, Param, Patch } from '@nestjs/common';
import { LobbyService, Roles } from './lobby.service';
import { LobbyGateway } from '../gateway/lobby.gateway';
@Controller('lobby')
export class LobbyController {
  constructor(
    private readonly lobbyService: LobbyService,
    private readonly lobbyGateway: LobbyGateway,
  ) {}

  @Post('createLobby')
  create(
    @Body()
    body: {
      hostName: string;
      avatarId: number;
      playersNumber: number;
      mafiaNumber: number;
      roles: Roles[];
    },
  ) {
    return this.lobbyService.createLobby(
      body.hostName,
      body.avatarId,
      body.playersNumber,
      body.mafiaNumber,
      body.roles,
    );
  }

  @Post('join/:lobbyId')
  joinLobby(
    @Body()
    {
      lobbyId,
      username,
      avatarId,
    }: {
      lobbyId: string;
      username: string;
      avatarId: number;
    },
  ) {
    return this.lobbyService.joinLobby(lobbyId, { username, avatarId });
  }

  @Get(':lobbyId')
  getLobby(@Param('lobbyId') lobbyId: string) {
    return this.lobbyService.getLobby(lobbyId);
  }

  @Patch('updateRoles/:lobbyId')
  updateRoles(
    @Param('lobbyId') lobbyId: string,
    @Body('roles') roles: Roles[],
  ) {
    return this.lobbyService.updateRoles(lobbyId, roles);
  }

  @Post('assign-roles/:lobbyId')
  assignRoles(@Param('lobbyId') lobbyId: string) {
    this.lobbyService.assignRoles(lobbyId);
    this.lobbyGateway.emitLobbyPlayers(lobbyId);
    return { message: 'Ролі розподілені' };
  }

  @Post('resetRoles/:lobbyId')
  resetRoles(@Param('lobbyId') lobbyId: string) {
    this.lobbyService.resetRoles(lobbyId);
    this.lobbyGateway.emitLobbyPlayers(lobbyId);
    return { message: 'Ролі скинуто' };
  }
}
