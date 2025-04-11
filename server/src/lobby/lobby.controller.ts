import { Controller, Post, Get, Body, Param, Patch } from '@nestjs/common';
import { LobbyService, Roles } from './lobby.service';

@Controller('lobby')
export class LobbyController {
  constructor(private readonly lobbyService: LobbyService) {}

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
}
