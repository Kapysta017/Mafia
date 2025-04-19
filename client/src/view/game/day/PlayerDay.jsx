import { useState, useEffect } from "react";
import { avatars } from "../../../utils/avatars";
export function PlayerDay({ host, users }) {
  const [username, setUsername] = useState("");
  useEffect(() => {
    setUsername(localStorage.getItem("profileName"));
  }, []);

  const getAvatarUrl = (avatarId) => {
    const avatar = avatars.find((avatar) => avatar.id === avatarId);
    return avatar ? avatar.url : "/avatars/default.png";
  };

  return (
    <div className="player_lobby_container">
      <h2>ПРИВАТНИЙ СТІЛ: {host.username}</h2>
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
          <div className="ready_container"></div>
        </div>
      </div>
    </div>
  );
}
