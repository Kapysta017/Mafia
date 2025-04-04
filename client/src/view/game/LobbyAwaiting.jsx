import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { HostLobby } from "./HostLobby";
import { PlayerLobby } from "./PlayerLobby";
import { io } from "socket.io-client";

export function LobbyAwainting() {
  const { lobbyId } = useParams();
  const isHost = localStorage.getItem("isHost") === "true";
  const [host, setHost] = useState("");
  const [users, setUsers] = useState([]);
  const socket = io("http://localhost:3000");
  const getLobby = async (lobbyId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/lobby/${lobbyId}`
      );
      console.log("Лобі:", response.data);
      setHost(response.data.hostName);
      setUsers(response.data.players);
    } catch (error) {
      console.error("Помилка отримання лобі:", error);
      return null;
    }
  };

  useEffect(() => {
    getLobby(lobbyId);
  }, [lobbyId]);

  useEffect(() => {
    socket.emit("joinLobby", { lobbyId });

    const handleLobbyUpdate = (updatedPlayers) => {
      setUsers(updatedPlayers);
    };

    socket.on("lobbyUpdated", handleLobbyUpdate);

    return () => {
      socket.off("lobbyUpdated", handleLobbyUpdate);
      socket.disconnect();
    };
  }, [lobbyId]);

  return isHost ? <HostLobby /> : <PlayerLobby host={host} users={users} />;
}
