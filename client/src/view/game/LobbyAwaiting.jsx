import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { HostLobby } from "./HostLobby";
import { PlayerLobby } from "./PlayerLobby";
import { socket } from "../../utils/socket";
import { HostGame } from "./HostGame";
export function LobbyAwainting() {
  const { lobbyId } = useParams();
  const isHost = sessionStorage.getItem("isHost") === "true";
  const [host, setHost] = useState({});
  const [users, setUsers] = useState([]);
  const [settings, setSettings] = useState({});
  const [state, setState] = useState("");
  const [aiAnswer, setAiAnswer] = useState(Boolean);
  const [nightActions, setNightActions] = useState({});

  const getLobby = async (lobbyId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/lobby/${lobbyId}/getLobby`
      );
      setHost(response.data.host);
      setSettings(response.data.settings);
      setState(response.data.state);
      setAiAnswer(response.data.aiAnswer);
    } catch (error) {
      console.error("Помилка отримання лобі:", error);
      return null;
    }
  };

  const startVote = async (lobbyId) => {
    try {
      await axios.patch(`http://localhost:3000/lobby/${lobbyId}/startVote`);
    } catch (error) {
      console.error("Гравця е знайдено:", error);
    }
  };

  useEffect(() => {
    const vote = async () => {
      try {
        await startVote(lobbyId);
      } catch (error) {
        console.error("Помилка при старті голосування:", error);
      }
    };
    const alivePlayers = users.filter((p) => p.alive !== false);
    if (state.readyToVote?.length === alivePlayers?.length) {
      vote();
    }
  }, [state.readyToVote]);

  useEffect(() => {
    if (state.currentState == "night") {
      axios.post(`http://localhost:3000/lobby/${lobbyId}/start-night`);
    }
  }, [state.currentState]);

  useEffect(() => {
    getLobby(lobbyId);
    socket.emit("joinLobby", { lobbyId });
    const handleLobbyUpdate = (updatedPlayers) => {
      setUsers(updatedPlayers);
    };
    const handleStateUpdated = (updatedState) => {
      setState(updatedState);
    };

    const handleLobbyFullUpdate = (lobbyData) => {
      setUsers(lobbyData.players);
      setState(lobbyData.state);
      setNightActions(lobbyData.nightActions);
    };
    socket.on("lobbyUpdated", handleLobbyUpdate);
    socket.on("stateUpdated", handleStateUpdated);
    socket.on("lobbyFullUpdate", handleLobbyFullUpdate);
    return () => {
      socket.off("lobbyUpdated", handleLobbyUpdate);
      socket.off("stateUpdated", handleStateUpdated);
      socket.off("lobbyFullUpdate", handleLobbyFullUpdate);
    };
  }, [lobbyId]);

  switch (state.currentState) {
    case "waiting":
      return isHost ? (
        <HostLobby
          settings={settings}
          host={host}
          users={users}
          aiAnswer={aiAnswer}
        />
      ) : (
        <PlayerLobby
          settings={settings}
          host={host}
          users={users}
          state={state}
        />
      );
    case "night":
      return isHost ? (
        <div>
          <HostGame
            settings={settings}
            host={host}
            users={users}
            state={state}
            aiAnswer={aiAnswer}
          ></HostGame>
        </div>
      ) : (
        <PlayerLobby
          nightActions={nightActions}
          host={host}
          users={users}
          state={state}
        />
      );
    case "day":
      return isHost ? (
        <HostGame
          settings={settings}
          host={host}
          users={users}
          state={state}
          aiAnswer={aiAnswer}
        ></HostGame>
      ) : (
        <PlayerLobby host={host} users={users} state={state} />
      );
    case "voting":
      return isHost ? (
        <HostGame
          settings={settings}
          host={host}
          users={users}
          state={state}
          aiAnswer={aiAnswer}
        ></HostGame>
      ) : (
        <PlayerLobby host={host} users={users} state={state} />
      );
    case "ended":
      return <div>Перемога</div>;
    default:
      return <div> Невідомий стан гри</div>;
  }
}
