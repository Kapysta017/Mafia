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

  emitLobbyPlayers(lobbyId: string) {
    const lobby = this.lobbyService.getLobby(lobbyId);
    if ('players' in lobby) {
      this.server.to(lobbyId).emit('lobbyUpdated', lobby.players);
    } else {
      console.error(`Лобі ${lobbyId} не знайдено.`);
    }
  }

  emitLobbyState(lobbyId: string) {
    const lobby = this.lobbyService.getLobby(lobbyId);

    if ('state' in lobby) {
      this.server.to(lobbyId).emit('stateUpdated', lobby.state);
    } else {
      console.error(lobby.message);
    }
  }
  @SubscribeMessage('chatMessage')
  handleChatMessage(
    @MessageBody() data: { lobbyId: string; username: string; text: string },
  ) {
    this.server.to(data.lobbyId).emit('chatMessage', {
      username: data.username,
      text: data.text,
    });
  }

  @SubscribeMessage('joinLobby')
  handleJoinLobby(@MessageBody() data: { lobbyId: string; username: string }) {
    this.server.socketsJoin(data.lobbyId);
    this.emitLobbyPlayers(data.lobbyId);
  }
}
