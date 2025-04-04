import { Button } from "../../components/Button";
import { useState, useEffect } from "react";

export function PlayerLobby({ host, users }) {
  const [username, setUsername] = useState("");
  useEffect(() => {
    setUsername(localStorage.getItem("profileName"));
  }, []);

  return (
    <div className="player_lobby_container">
      <h2>Приватний стіл: {host}</h2>
      <div className="rules"></div>
      <div className="players_container">
        <div className="player_dashboard">
          <div className="player_item">
            <div className="avatar"></div>
            <div className="player_name">{host}</div>
          </div>
          {users.map((user, index) => (
            <div className="player_item" key={index}>
              <div className="avatar"></div>
              <div className="player_name">
                {user.length > 10 ? user.substring(0, 10) + "..." : user}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="player_ready_container">
        <div className="ready_main">
          <div className="player_info">
            <div className="avatar"></div>
            <div className="player_name">{username}</div>
          </div>
          <div className="ready_status">
            <div className="status">status</div>
            <div className="ready_button">
              <Button variant="secondary" size="medium">
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
