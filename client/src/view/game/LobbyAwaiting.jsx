import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
export function LobbyAwainting() {
  const { lobbyId } = useParams();
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
  socket.emit("joinLobby", { lobbyId });
  socket.on("lobbyUpdated", (updatedPlayers) => {
    setUsers(updatedPlayers);
  });
  return (
    <div>
      <h2>Лобі ID: {lobbyId}</h2>
      <h3>Хост: {host}</h3>
      <h3>Гравці:</h3>
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul>
    </div>
  );
}
