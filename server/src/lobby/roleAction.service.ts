import { Injectable } from '@nestjs/common';
import { Lobby } from '../lobby/lobby.service';
@Injectable()
export class RoleActionService {
  performMistressAction(
    lobby: Lobby,
    mistressId: number,
    targetId: number,
    targetName,
  ) {
    const mistress = lobby.players.find((p) => p.id === mistressId);
    if (mistress?.role !== 'Коханка') {
      return { message: 'Гравець не є коханкою' };
    }

    if (mistressId === targetId) {
      return { message: 'Куртизанка не може вибрати себе' };
    }
    const target = lobby.players.find((p) => p.id === targetId);
    if (!target) {
      return { message: 'Ціль не знайдена' };
    }
    if (!lobby.nightActions) lobby.nightActions = {};
    lobby.nightActions.blockedPlayers = lobby.nightActions.blockedPlayers || [];
    lobby.nightActions.blockedPlayers.push(targetName);
  }

  performMafiaAction(
    lobby: Lobby,
    mafiaId: number,
    targetId: number,
    targetName,
  ) {
    const mafia = lobby.players.find((p) => p.id === mafiaId);
    if (!mafia || (mafia.role !== 'Мафія' && mafia.role !== 'Дон')) {
      return { message: 'Гравець не є мафією' };
    }

    const target = lobby.players.find((p) => p.id === targetId);
    if (!target) {
      return { message: 'Ціль не знайдено' };
    }

    if (!lobby.nightActions) {
      lobby.nightActions = {};
    }

    // Ініціалізуємо голоси, якщо треба
    if (!Array.isArray(lobby.nightActions.proposals)) {
      lobby.nightActions.proposals = [];
    }

    lobby.nightActions.proposals.push({ mafiaId, targetId });

    if (mafia.role === 'Дон') {
      lobby.nightActions.mafiaTarget = target;
    }

    mafia.action = true;

    return {
      message:
        mafia.role === 'Дон'
          ? `Дон обрав вбити ${targetName}`
          : `Мафія запропонувала вбити ${targetName}`,
    };
  }

  performDoctorAction(
    lobby: Lobby,
    playerId: number,
    targetId: number,
    targetName,
  ) {
    const doctor = lobby.players.find((p) => p.id === playerId);
    if (doctor?.role !== 'Доктор') {
      return { message: 'Гравець не є доктором' };
    }
    const target = lobby.players.find((p) => p.id === targetId);
    if (!lobby.nightActions) {
      lobby.nightActions = {};
    }
    lobby.nightActions.healedPlayer = target;
    doctor.action = true;
    return { message: `Доктор зберіг ${targetName}` };
  }
}
