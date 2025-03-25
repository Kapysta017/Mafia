import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { LobbyService } from './lobby.service';

@Controller('lobby')
export class LobbyController {
  constructor(private readonly lobbyService: LobbyService) {}

  @Post('create')
  createLobby(@Body('hostName') hostName: string) {
    return this.lobbyService.createLobby(hostName);
  }

  @Post('join/:lobbyId')
  joinLobby(
    @Body() { lobbyId, username }: { lobbyId: string; username: string },
  ) {
    return this.lobbyService.joinLobby(lobbyId, username);
  }

  @Get(':lobbyId')
  getLobby(@Param('lobbyId') lobbyId: string) {
    return this.lobbyService.getLobby(lobbyId);
  }
}
