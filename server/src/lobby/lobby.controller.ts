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
      aiAnswer: boolean;
    },
  ) {
    return this.lobbyService.createLobby(
      body.hostName,
      body.avatarId,
      body.playersNumber,
      body.mafiaNumber,
      body.roles,
      body.aiAnswer,
    );
  }

  @Post(':lobbyId/join')
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

  @Get(':lobbyId/getLobby')
  getLobby(@Param('lobbyId') lobbyId: string) {
    return this.lobbyService.getLobby(lobbyId);
  }

  @Patch(':lobbyId/updateRoles')
  updateRoles(
    @Param('lobbyId') lobbyId: string,
    @Body('roles') roles: Roles[],
  ) {
    return this.lobbyService.updateRoles(lobbyId, roles);
  }

  @Post(':lobbyId/assign-roles')
  assignRoles(@Param('lobbyId') lobbyId: string) {
    this.lobbyService.assignRoles(lobbyId);
    this.lobbyGateway.emitLobbyPlayers(lobbyId);
    return { message: 'Ролі розподілені' };
  }

  @Post(':lobbyId/resetRoles')
  resetRoles(@Param('lobbyId') lobbyId: string) {
    this.lobbyService.resetRoles(lobbyId);
    this.lobbyGateway.emitLobbyPlayers(lobbyId);
    return { message: 'Ролі скинуто' };
  }

  @Post(':lobbyId/setReadyStatus')
  handlePlayerReadyStatus(
    @Param('lobbyId') lobbyId: string,
    @Body() body: { id: number; ready: boolean },
  ) {
    const result = this.lobbyService.handlePlayerReadyStatus(
      lobbyId,
      body.id,
      body.ready,
    );

    this.lobbyGateway.emitLobbyPlayers(lobbyId);

    return result;
  }

  @Get(':lobbyId/:id/getPlayer')
  getPlayer(@Param('lobbyId') lobbyId: string, @Param('id') id: number) {
    return this.lobbyService.getPlayer(lobbyId, id);
  }

  @Get(':lobbyId/startGame')
  startGame(@Param('lobbyId') lobbyId: string) {
    const result = this.lobbyService.startGame(lobbyId);
    this.lobbyGateway.emitLobbyState(lobbyId);
    return result;
  }
}
