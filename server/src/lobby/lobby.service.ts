import { Injectable } from '@nestjs/common';
import { RoleActionService } from './roleAction.service';
import { LobbyGateway } from 'src/gateway/lobby.gateway';
export interface Player {
  id?: number;
  username: string;
  avatarId: number;
  role?: string;
  ready?: boolean;
  alive?: boolean;
  action?: boolean;
  votes?: number;
  voted?: boolean;
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
type PosibleStates = 'waiting' | 'night' | 'day' | 'voting' | 'ended';

export interface GameState {
  currentState: PosibleStates;
  activeRole?: string;
  readyToVote?: string[];
}
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
  mafiaTarget?: Player; // Дон
  healedPlayer?: Player; // лікар
  investigatedPlayer?: number; // Комісар
  proposals?: { mafiaId: number; targetId: number }[]; // мафія
}

@Injectable()
export class LobbyService {
  constructor(
    private readonly roleActionService: RoleActionService,
    private readonly lobbyGateway: LobbyGateway,
  ) {}
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
      state: { currentState: 'waiting' as PosibleStates },
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

    const playersWithoutRoles = lobby.players.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ role, ...player }) => player,
    );

    const settingsWithAvailableRoles = {
      ...lobby.settings,
      roles: lobby.settings.roles.filter((r) => r.status !== false),
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { nightActions, players, ...lobbyWithoutSensitiveData } = lobby;

    return {
      ...lobbyWithoutSensitiveData,
      players: playersWithoutRoles,
      settings: settingsWithAvailableRoles,
    };
  }

  getFullLobby(lobbyId: string) {
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

  handleVotingReadyStatus(lobbyId: string, id: number) {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) return;
    const player = lobby.players.find((p) => p.id == id);
    if (!lobby.state.readyToVote) {
      lobby.state.readyToVote = [];
    }
    if (player?.alive === false) {
      return { message: 'Гравець мертвий' };
    }
    if (player) {
      lobby.state.readyToVote?.push(player.username);
    }
    this.lobbyGateway.emitLobbyState(lobbyId);
    return { message: 'Статус встановленно успішно' };
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
    lobby.state.currentState = 'night';
    lobby.players.every((p) => (p.alive = true));
    return { message: 'Гра розпочалася' };
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

  startVote(lobbyId: string) {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) return;
    const deadPlayers = lobby.players.filter((p) => p.alive == false);
    if (
      lobby.state.readyToVote?.length ==
      lobby.players.length - deadPlayers.length
    ) {
      lobby.state.currentState = 'voting';
      lobby.state.readyToVote = [];
      this.lobbyGateway.emitLobbyState(lobbyId);
      return { message: 'Голосування розпочалось' };
    } else return { message: 'Не усі готові голосувати' };
  }

  waitForPlayerAction(lobby: Lobby, roleName: string): Promise<void> {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const player = lobby.players.find(
          (p) => p.role === roleName && p.action === true,
        );
        if (player) {
          clearInterval(interval);
          player.action = false;
          resolve();
        }
      }, 500);
    });
  }

  async performNightPhase(lobbyId: string) {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) return { message: 'Лобі не знайдено' };
    const activeRoles = lobby.settings.roles.filter(
      (role) => role.action === true && role.status === true,
    );

    for (const role of activeRoles) {
      console.log(`🎭 Роль ${role.roleName} діє`);
      lobby.state.activeRole = role.roleName;
      this.lobbyGateway.emitFullLobbyState(lobbyId);

      await this.waitForPlayerAction(lobby, role.roleName);
      lobby.state.activeRole = 'Ніхто';
    }

    if (lobby.nightActions?.mafiaTarget) {
      lobby.nightActions.mafiaTarget.alive = false;
    }
    if (lobby.nightActions?.healedPlayer) {
      lobby.nightActions.healedPlayer.alive = true;
    }

    lobby.state.currentState = 'day';
    this.lobbyGateway.emitFullLobbyState(lobbyId);
    return { message: 'Ніч завершено' };
  }

  performRoleAction(lobbyId: string, playerId: number, targetId: number) {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) return { message: 'Лобі не знайдено' };

    const targetName = lobby.players.find((p) => p.id === targetId)?.username;
    const player = lobby.players.find((p) => p.id === playerId);
    if (!player || !player.alive)
      return { message: 'Гравця не знайдено або він мертвий' };

    switch (player.role) {
      case 'Дон':
      case 'Мафія':
        this.roleActionService.performMafiaAction(
          lobby,
          playerId,
          targetId,
          targetName,
        );
        break;
      case 'Доктор':
        this.roleActionService.performDoctorAction(
          lobby,
          playerId,
          targetId,
          targetName,
        );
        break;
      case 'Коханка':
        this.roleActionService.performMistressAction(
          lobby,
          playerId,
          targetId,
          targetName,
        );
        break;
      default:
        return { message: 'У ролі немає активної дії' };
    }

    player.action = true;
  }

  getAllMafia(lobbyId: string) {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) return { message: 'Лобі не знайдено' };
    const allMafiaPlayers = lobby.players.filter(
      (p) => p.role == 'Мафія' || p.role == 'Дон',
    );
    return allMafiaPlayers.filter((p) => ({
      id: p.id,
      username: p.username,
    }));
  }

  handleVote(lobbyId: string, playerId: number, targetId: number) {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) return { message: 'Лобі не знайдено' };

    const player = lobby.players.find((p) => p.id === playerId);
    if (!player) return { message: 'Гравця не знайдено' };

    const target = lobby.players.find((p) => p.id === targetId);
    if (!target) return { message: 'Ціль не знайдена' };

    if (typeof target.votes !== 'number') {
      target.votes = 0;
    }

    player.voted = true;
    target.votes += 1;

    const alivePlayers = lobby.players.filter((p) => p.alive !== false);
    const allPlayersVoted = alivePlayers.every((p) => p.voted);

    if (allPlayersVoted) {
      const maxVotes = Math.max(...lobby.players.map((p) => p.votes || 0));
      const topVoted = lobby.players.filter((p) => (p.votes || 0) === maxVotes);

      if (topVoted.length === 1) {
        topVoted[0].alive = false;
      } else {
        console.log('Нічия. Жоден гравець не вибув.');
      }

      lobby.players.forEach((p) => {
        p.voted = false;
        p.votes = 0;
      });

      lobby.state.currentState = 'night';
      this.lobbyGateway.emitFullLobbyState(lobbyId);
    }

    return {
      message: `Гравець ${player.username} проголосував за ${target.username}`,
    };
  }
}
