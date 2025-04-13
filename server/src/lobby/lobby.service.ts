import { Injectable } from '@nestjs/common';
import { LobbyGateway } from '../gateway/lobby.gateway';

export interface Player {
  username: string;
  avatarId: number;
  role?: string;
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

  assignRoles(lobbyId: string) {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) throw new Error('Лобі не знайдено');

    const players = [...lobby.players];
    const otherRoles = lobby.settings.roles.filter((r) => r.status);
    let donCount = 0;
    if (
      lobby.settings.roles.find(
        (r) => r.roleName === 'Дон' && r.status === true,
      )
    ) {
      donCount = 1;
    }
    const mafiaCount = lobby.settings.mafiaNumber - donCount;
    const playersWithIndex = players.map((player, index) => ({
      ...player,
      originalIndex: index,
    }));

    const shuffledPlayers = [...playersWithIndex].sort(
      () => Math.random() - 0.5,
    );

    const totalRolesNeeded = mafiaCount + otherRoles.length;
    if (totalRolesNeeded > shuffledPlayers.length) {
      throw new Error('Недостатньо гравців для всіх ролей');
    }

    for (let i = 0; i < mafiaCount; i++) {
      shuffledPlayers[i].role = 'Мафія';
    }

    for (let i = 0; i < otherRoles.length; i++) {
      shuffledPlayers[mafiaCount + i].role = otherRoles[i].roleName;
    }
    for (
      let i = mafiaCount + otherRoles.length;
      i < shuffledPlayers.length;
      i++
    ) {
      shuffledPlayers[i].role = 'Мирний';
    }
    const originalOrderPlayers = shuffledPlayers.sort(
      (a, b) => a.originalIndex - b.originalIndex,
    );
    lobby.players = originalOrderPlayers;

    return {
      message: 'Ролі призначено успішно',
      players: originalOrderPlayers,
    };
  }

  resetRoles(lobbyId: string) {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) throw new Error('Лобі не знайдено');
    const players = [...lobby.players];
    for (let i = 0; i < players.length; i++) {
      players[i].role = 'Мирний';
    }
    return { message: 'Ролі скинуто успішно', players: players };
  }
}
