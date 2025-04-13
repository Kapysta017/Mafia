import { Button } from "../../components/Button";
import { useState, useEffect, use } from "react";
import { avatars } from "../../utils/avatars";
import { useParams } from "react-router-dom";
import axios from "axios";
export function PlayerLobby({ host, users }) {
  const { lobbyId } = useParams();
  const [username, setUsername] = useState("");
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    setUsername(localStorage.getItem("profileName"));
  }, []);

  const getAvatarUrl = (avatarId) => {
    const avatar = avatars.find((avatar) => avatar.id === avatarId);
    return avatar ? avatar.url : "/avatars/default.png";
  };
  const setReadyStatus = async (lobbyId) => {
    try {
      await axios.post(
        `http://localhost:3000/lobby/setReadyStatus/${lobbyId}`,
        {
          username,
          ready: isReady,
        }
      );
    } catch (error) {
      console.error("Помилка в надсиланні статусу:", error);
    }
  };
  useEffect(() => {
    if (username) {
      setReadyStatus(lobbyId);
    }
  }, [isReady]);

  return (
    <div className="player_lobby_container">
      <h2>Приватний стіл: {host.username}</h2>
      <div className="rules"></div>
      <div className="players_container">
        <div className="player_dashboard">
          {users.map((user, index) => (
            <div className="player_item" key={index}>
              <img src={getAvatarUrl(user.avatarId)} className="avatar"></img>
              <div className="player_name">
                {user.username.length > 10
                  ? user.username.substring(0, 10) + "..."
                  : user.username}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="player_ready_container">
        <div className="ready_main">
          <div className="player_info">
            <img
              src={getAvatarUrl(
                Number(localStorage.getItem("profileAvatarId"))
              )}
              className="avatar"
            ></img>
            <div className="player_name">{username}</div>
          </div>
          <div className="ready_status">
            {isReady ? (
              <div
                className="status"
                style={{
                  color: "green",
                }}
              >
                ✓
              </div>
            ) : (
              <div
                className="status"
                style={{
                  color: "red",
                }}
              >
                X
              </div>
            )}
            <div className="ready_button">
              <Button
                onClick={() => setIsReady((prev) => !prev)}
                variant="secondary"
                size="medium"
              >
                Готовий
              </Button>
            </div>
          </div>
          <div className="ready_container"></div>
        </div>
      </div>
    </div>
  );
}
