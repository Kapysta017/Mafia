import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { HostLobby } from "./HostLobby";
import { PlayerLobby } from "./PlayerLobby";
import { socket } from "../../utils/socket";
import { HostDay } from "./day/HostDay";
export function LobbyAwainting() {
  const { lobbyId } = useParams();
  const isHost = localStorage.getItem("isHost") === "true";
  const [host, setHost] = useState({});
  const [users, setUsers] = useState([]);
  const [settings, setSettings] = useState({});
  const [state, setState] = useState("");
  const [aiAnswer, setAiAnswer] = useState(Boolean);
  const getLobby = async (lobbyId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/lobby/${lobbyId}/getLobby`
      );
      setHost(response.data.host);
      setUsers(response.data.players);
      setSettings(response.data.settings);
      setState(response.data.state);
      setAiAnswer(response.data.aiAnswer);
    } catch (error) {
      console.error("Помилка отримання лобі:", error);
      return null;
    }
  };

  useEffect(() => {
    getLobby(lobbyId);
    socket.emit("joinLobby", { lobbyId });
    const handleLobbyUpdate = (updatedPlayers) => {
      setUsers(updatedPlayers);
    };
    const handleStateUpdated = (updatedState) => {
      setState(updatedState);
    };
    socket.on("lobbyUpdated", handleLobbyUpdate);
    socket.on("stateUpdated", handleStateUpdated);
    return () => {
      socket.off("lobbyUpdated", handleLobbyUpdate);
      socket.off("stateUpdated", handleStateUpdated);
    };
  }, [lobbyId]);

  switch (state) {
    case "waiting":
      return isHost ? (
        <HostLobby
          settings={settings}
          host={host}
          users={users}
          aiAnswer={aiAnswer}
        />
      ) : (
        <PlayerLobby host={host} users={users} state={state} />
      );
    case "night":
      return isHost ? (
        <div>Ніч</div>
      ) : (
        <PlayerLobby host={host} users={users} state={state} />
      );
    case "day":
      return isHost ? (
        <HostDay
          settings={settings}
          host={host}
          users={users}
          aiAnswer={aiAnswer}
        />
      ) : (
        <PlayerLobby host={host} users={users} state={state} />
      );
    case "voting":
      return <div>Голосування</div>;
    case "ended":
      return <div>Перемога</div>;
    default:
      return <div> Невідомий стан гри</div>;
  }
}
