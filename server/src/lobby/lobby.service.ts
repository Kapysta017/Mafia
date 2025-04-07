import { Injectable } from '@nestjs/common';
import { LobbyGateway } from '../gateway/lobby.gateway';

export interface Player {
  username: string;
  avatarId: number;
}

@Injectable()
export class LobbyService {
  private lobbies = new Map<string, { host: Player; players: Player[] }>();

  constructor(private readonly lobbyGateway: LobbyGateway) {}

  createLobby(hostName: string, avatarId: number) {
    const lobbyId = Math.random().toString(36).substring(2, 8);
    const newLobby = {
      host: { username: hostName, avatarId },
      players: [],
    };
    this.lobbies.set(lobbyId, newLobby);
    return lobbyId;
  }

  joinLobby(lobbyId: string, player: Player) {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) {
      return { success: false, message: 'Лобі не знайдено' };
    }

    if (lobby.players.find((p) => p.username === player.username)) {
      return { success: false, message: 'Гравець уже в лобі' };
    }

    lobby.players.push(player);
    return { success: true, players: lobby.players };
  }

  getLobby(lobbyId: string) {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) return { message: 'Лобі не знайдено' };
    return lobby;
  }
}
