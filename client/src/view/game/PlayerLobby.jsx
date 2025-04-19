import { Button } from "../../components/Button";
import { socket } from "../../utils/socket";
import { useState, useEffect, use } from "react";
import { avatars } from "../../utils/avatars";
import { useParams } from "react-router-dom";
import { ChatModal } from "../../components/ChatModal";
import { PlayerHeader } from "../../components/PlayerHeader";
import axios from "axios";
import { StatusButton } from "../../components/StatusButton";
export function PlayerLobby({ host, users, state }) {
  const { lobbyId } = useParams();
  const [username, setUsername] = useState("");
  const [selectedUser, setSelectedUser] = useState({});
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState({});
  const id = localStorage.getItem("id");
  useEffect(() => {
    const storedName = localStorage.getItem("profileName");
    setUsername(storedName);
    const fetchUser = async () => {
      const id = Number(localStorage.getItem("id"));
      if (storedName && id) {
        getPlayer(lobbyId, id).then((data) => {
          setUser(data);
        });
      }
    };
    fetchUser();
    socket.on("stateUpdated", fetchUser);

    return () => {
      socket.off("stateUpdated", fetchUser);
    };
  }, []);
  const getAvatarUrl = (avatarId) => {
    const avatar = avatars.find((avatar) => avatar.id === avatarId);
    return avatar ? avatar.url : "/avatars/default.png";
  };
  const setReadyStatus = async (lobbyId) => {
    try {
      await axios.post(
        `http://localhost:3000/lobby/${lobbyId}/setReadyStatus`,
        {
          id,
          ready: isReady,
        }
      );
    } catch (error) {
      console.error("Помилка в надсиланні статусу:", error);
    }
  };

  const getPlayer = async (lobbyId, id) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/lobby/${lobbyId}/${id}/getPlayer`
      );
      return response.data;
    } catch (error) {
      console.error("Гравця е знайдено:", error);
    }
  };
  useEffect(() => {
    if (username) {
      setReadyStatus(lobbyId);
    }
  }, [isReady]);
  console.log(users);
  return (
    <div className="player_lobby_container">
      <h2>Приватний стіл: {host.username}</h2>
      <PlayerHeader state={{ state }}></PlayerHeader>
      <div className="players_container">
        <div className="player_dashboard">
          {users.map((user, index) => (
            <div
              className="player_item"
              onClick={() => setSelectedUser(user)}
              key={index}
            >
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
          <StatusButton
            state={state}
            isReady={isReady}
            setIsReady={setIsReady}
            user={user}
            selectedUser={selectedUser}
          ></StatusButton>
        </div>
      </div>
      <ChatModal lobbyId={lobbyId} username={username} />
    </div>
  );
}
