import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { LobbyService } from '../lobby/lobby.service';
import { Player } from '../lobby/lobby.service';

@WebSocketGateway({ cors: true })
@Injectable()
export class LobbyGateway {
  constructor(
    @Inject(forwardRef(() => LobbyService))
    private readonly lobbyService: LobbyService,
  ) {}

  @WebSocketServer()
  server: Server;

  updateLobby(lobbyId: string, players: Player[]) {
    this.server.to(lobbyId).emit('lobbyUpdated', players);
  }

  @SubscribeMessage('joinLobby')
  handleJoinLobby(@MessageBody() data: { lobbyId: string; username: string }) {
    this.server.socketsJoin(data.lobbyId);
    const lobby = this.lobbyService.getLobby(data.lobbyId);

    if ('players' in lobby) {
      this.server.to(data.lobbyId).emit('lobbyUpdated', lobby.players);
    } else {
      console.error(`Лобі ${data.lobbyId} не знайдено.`);
    }
  }
}
