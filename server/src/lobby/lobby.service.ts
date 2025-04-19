import { Injectable } from '@nestjs/common';
import { RoleActionService } from './roleAction.service';

export interface Player {
  id?: number;
  username: string;
  avatarId: number;
  role?: string;
  ready?: boolean;
  alive?: boolean;
  action?: boolean;
}

export interface Settings {
  playersNumber: number;
  mafiaNumber: number;
  roles: Roles[];
}

export interface Roles {
  roleName: string;
  status: boolean;
  action?: boolean;
  ableToAct?: boolean;
}
type GameState = 'waiting' | 'night' | 'day' | 'voting' | 'ended';

export interface Lobby {
  host: Player;
  players: Player[];
  settings: Settings;
  state: GameState;
  aiAnswer: boolean;
  nightActions?: NightActions;
}
export interface NightActions {
  blockedPlayers?: string[]; // куртизанка
  mafiaTarget?: string; // мафія
  healedPlayer?: string; // лікар
  investigatedPlayer?: string; // комісар
  // ...інші дії ролей
}

@Injectable()
export class LobbyService {
  constructor(private readonly roleActionService: RoleActionService) {}
  private lobbies = new Map<string, Lobby>();

  createLobby(
    hostName: string,
    avatarId: number,
    playersNumber: number,
    mafiaNumber: number,
    roles: Roles[],
    aiAnswer: boolean,
  ) {
    const lobbyId = Math.random().toString(36).substring(2, 8);
    const hostPlayer: Player = { id: 1, username: hostName, avatarId };

    const newLobby = {
      host: hostPlayer,
      players: aiAnswer ? [hostPlayer] : [],
      settings: { playersNumber, mafiaNumber, roles },
      state: 'waiting' as GameState,
      aiAnswer,
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
    player.id = lobby.players.length;
    return { success: true, players: lobby.players, id: player.id };
  }

  getLobby(lobbyId: string) {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) return { message: 'Лобі не знайдено' };
    return lobby;
  }

  getPlayer(lobbyId: string, id: number) {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) return { message: 'Лобі не знайдено' };
    const player = lobby.players.find((player) => player.id == id);
    if (!player) return { message: `Гравця не знайдено` };
    return player;
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

  handlePlayerReadyStatus(lobbyId: string, id: number, ready: boolean) {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) return;

    const player = lobby.players.find((p) => p.id == id);
    if (player) {
      player.ready = ready;
    }

    return { message: 'Статус встановленно успішно' };
  }
  setAbleToAct(lobbyId: string, numberOfAction: number) {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) return;
    const activeRoles = lobby.settings.roles.filter(
      (role) => role.status === true && role.action === true,
    );
    activeRoles[numberOfAction].ableToAct = true;
  }
  startGame(lobbyId: string) {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) return;
    const allReady = lobby.players.every((player) => player.ready);
    // if (lobby.players.length < 4) {
    //   return { message: 'Недостатньо гравців для початку гри' };
    // }
    if (!allReady) {
      return { message: 'Не всі гравці готові' };
    }
    lobby.state = 'night';
    this.setAbleToAct(lobbyId, 0);
    return { message: 'Гра розпочалася' };
  }

  performRoleAction(
    lobbyId: string,
    roleName: string,
    ...args: [string, string]
  ) {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) return { message: 'Лобі не знайдено' };

    switch (roleName) {
      case 'Дон':
        return this.roleActionService.performMafiaAction(lobby, ...args);
      case 'Доктор':
        return this.roleActionService.performDoctorAction(lobby, ...args);
      // інші кейси
    }
  }
}
