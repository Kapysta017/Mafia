import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class LobbyGateway {
  @WebSocketServer()
  server: Server;

  updateLobby(lobbyId: string, players: string[]) {
    this.server.to(lobbyId).emit('lobbyUpdated', players);
  }

  @SubscribeMessage('joinLobby')
  handleJoinLobby(@MessageBody() data: { lobbyId: string; username: string }) {
    this.server.socketsJoin(data.lobbyId);
    this.server.to(data.lobbyId).emit('playerJoined', data.username);
  }
}
