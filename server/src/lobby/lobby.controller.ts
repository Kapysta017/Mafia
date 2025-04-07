import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { LobbyService } from './lobby.service';

@Controller('lobby')
export class LobbyController {
  constructor(private readonly lobbyService: LobbyService) {}

  @Post('createLobby')
  create(@Body() body: { hostName: string; avatarId: number }) {
    return this.lobbyService.createLobby(body.hostName, body.avatarId);
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
}
