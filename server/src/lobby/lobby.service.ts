import { Injectable } from '@nestjs/common';
import { LobbyGateway } from '../gateway/lobby.gateway';
@Injectable()
export class LobbyService {
  private lobbies = new Map<string, { hostName: string; players: string[] }>();
  constructor(private readonly lobbyGateway: LobbyGateway) {}
  createLobby(hostName: string) {
    const lobbyId = Math.random().toString(36).substring(2, 8);
    const newLobby = { hostName, players: [] };
    this.lobbies.set(lobbyId, newLobby);
    return lobbyId;
  }

  joinLobby(lobbyId: string, username: string) {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) {
      return { success: false, message: 'Лобі не знайдено' };
    }
    if (lobby.players.includes(username)) {
      return { success: false, message: 'Гравець уже в лобі' };
    }
    lobby.players.push(username);
    this.lobbyGateway.updateLobby(lobbyId, lobby.players);
    return { success: true, players: lobby.players };
  }

  getLobby(lobbyId: string) {
    return this.lobbies.get(lobbyId) || { message: 'Лобі не знайдено' };
  }
}
