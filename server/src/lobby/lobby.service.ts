import { Injectable } from '@nestjs/common';
import { LobbyGateway } from '../gateway/lobby.gateway';

export interface Player {
  username: string;
  avatarId: number;
}

export interface Settings {
  playersNumber: number;
  mafiaNumber: number;
  roles: Roles[];
}

export interface Roles {
  roleName: string;
  status: boolean;
}

@Injectable()
export class LobbyService {
  private lobbies = new Map<
    string,
    { host: Player; players: Player[]; settings: Settings }
  >();

  constructor(private readonly lobbyGateway: LobbyGateway) {}

  createLobby(
    hostName: string,
    avatarId: number,
    playersNumber: number,
    mafiaNumber: number,
    roles: Roles[],
  ) {
    const lobbyId = Math.random().toString(36).substring(2, 8);
    const newLobby = {
      host: { username: hostName, avatarId },
      players: [],
      settings: { playersNumber, mafiaNumber, roles },
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

    if (lobby.settings.playersNumber === lobby.players.length) {
      return { success: false, message: 'Лоббі заповнене' };
    }

    lobby.players.push(player);
    return { success: true, players: lobby.players };
  }

  getLobby(lobbyId: string) {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) return { message: 'Лобі не знайдено' };
    return lobby;
  }

  updateRoles(lobbyId: string, roles: Roles[]) {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) throw new Error('Лобі не знайдено');
    lobby.settings.roles = roles;
    return { message: 'Ролі оновлено успішно' };
  }
}
