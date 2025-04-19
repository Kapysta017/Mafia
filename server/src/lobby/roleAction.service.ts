import { Injectable } from '@nestjs/common';
import { Lobby } from '../lobby/lobby.service';

@Injectable()
export class RoleActionService {
  performMistressAction(
    lobby: Lobby,
    mistressPlayerName: string,
    targetName: string,
  ) {
    const mistress = lobby.players.find(
      (p) => p.username === mistressPlayerName,
    );
    if (mistress?.role !== 'Коханка') {
      return { message: 'Гравець не є коханкою' };
    }

    if (mistressPlayerName === targetName) {
      return { message: 'Куртизанка не може вибрати себе' };
    }
    const target = lobby.players.find((p) => p.username === targetName);
    if (!target) {
      return { message: 'Ціль не знайдена' };
    }
    if (!lobby.nightActions) lobby.nightActions = {};
    lobby.nightActions.blockedPlayers = lobby.nightActions.blockedPlayers || [];
    lobby.nightActions.blockedPlayers.push(targetName);
  }
  performMafiaAction(
    lobby: Lobby,
    mafiaPlayerName: string,
    targetName: string,
  ) {
    const mafia = lobby.players.find((p) => p.username === mafiaPlayerName);
    if (mafia?.role !== 'Дон') {
      return { message: 'Гравець не є мафією' };
    }
    const target = lobby.players.find((p) => p.username === targetName);
    if (target) target.alive = false;

    return { message: `Мафія (${mafiaPlayerName}) вбила ${targetName}` };
  }

  performDoctorAction(lobby: Lobby, doctorName: string, targetName: string) {
    const doctor = lobby.players.find((p) => p.username === doctorName);
    if (doctor?.role !== 'Доктор') {
      return { message: 'Гравець не є доктором' };
    }
    const target = lobby.players.find((p) => p.username === targetName);
    if (target) target.alive = true;

    return { message: `Доктор (${doctorName}) зберіг ${targetName}` };
  }
}
