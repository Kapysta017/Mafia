import { Button } from "../../components/Button";
import { socket } from "../../utils/socket";
import { useState, useEffect, use } from "react";
import { avatars } from "../../utils/avatars";
import { useParams } from "react-router-dom";
import { ChatModal } from "../../components/ChatModal";
import { PlayerHeader } from "../../components/PlayerHeader";
import axios from "axios";
import { StatusButton } from "../../components/StatusButton";
export function PlayerLobby({ nightActions, settings, host, users, state }) {
  const { lobbyId } = useParams();
  const [username, setUsername] = useState("");
  const [selectedUser, setSelectedUser] = useState({});
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState({});
  const [mafia, setMafia] = useState([]);
  const [mafiaProposals, setMafiaProposals] = useState([]);
  useEffect(() => {
    if (nightActions?.proposals) {
      const targets = nightActions.proposals.map((p) => p.targetId);
      setMafiaProposals(targets);
    }
  }, [nightActions]);

  const id = sessionStorage.getItem("id");
  useEffect(() => {
    const storedName = localStorage.getItem("profileName");
    setUsername(storedName);
    const fetchUser = async () => {
      const id = Number(sessionStorage.getItem("id"));
      if (storedName && id) {
        getPlayer(lobbyId, id).then((data) => {
          setUser(data);
          if (data.role == "Мафія" || data.role === "Дон") {
            getMafia(lobbyId).then((mafiaData) => {
              setMafia(mafiaData);
            });
          }
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

  const getMafia = async (lobbyId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/lobby/${lobbyId}/getAllMafia`
      );
      return response.data;
    } catch (error) {
      console.error("Гравця е знайдено:", error);
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

  return (
    <div className="player_lobby_container">
      <h2>Приватний стіл: {host.username}</h2>
      <PlayerHeader state={state.currentState}></PlayerHeader>
      <div className="players_container">
        <div className="player_dashboard">
          {users.map((userItem, index) => {
            const isMafiaAlly =
              (user.role === "Мафія" || user.role === "Дон") &&
              mafia.find((m) => m.id === userItem.id);
            const isDead = userItem.alive === false;
            const isMafiaProposed =
              (user.role === "Мафія" || user.role === "Дон") &&
              mafiaProposals.includes(userItem.id);

            return (
              <div
                className="player_item"
                onClick={() => {
                  if (userItem.alive) setSelectedUser(userItem);
                }}
                key={index}
                style={isDead ? { color: "black" } : {}}
              >
                <img
                  src={getAvatarUrl(userItem.avatarId)}
                  style={{
                    ...(isDead && { backgroundColor: "gray" }),
                    ...(isMafiaProposed && { border: "2px solid red" }),
                  }}
                  className={`avatar ${
                    selectedUser?.id === userItem.id ? "selected_player" : ""
                  }`}
                />

                <div
                  className="player_name"
                  style={isMafiaAlly ? { color: "red" } : {}}
                >
                  {userItem.username.length > 10
                    ? userItem.username.substring(0, 10) + "..."
                    : userItem.username}
                </div>
              </div>
            );
          })}
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
            lobbyId={lobbyId}
            settings={settings}
            state={state}
            isReady={isReady}
            setIsReady={setIsReady}
            user={user}
            mafia={mafia}
            selectedUser={selectedUser}
          ></StatusButton>
        </div>
      </div>
      <ChatModal lobbyId={lobbyId} username={username} />
    </div>
  );
}
