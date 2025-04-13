import { useEffect, useState } from "react";
import { avatars } from "../../utils/avatars";
import { useParams } from "react-router-dom";
import { Button } from "../../components/Button";
import { getBorderColorByRole } from "../../utils/getSomethingByRole";
import axios from "axios";
export function HostLobby({ settings, host, users }) {
  const { lobbyId } = useParams();
  const [selectedUser, setSelectedUser] = useState({});
  useEffect(() => {
    if (host) setSelectedUser(host);
  }, [host]);
  const getAvatarUrl = (avatarId) => {
    const avatar = avatars.find((avatar) => avatar.id === avatarId);
    return avatar ? avatar.url : "/avatars/default.png";
  };

  const resetRoles = async (lobbyId) => {
    try {
      await axios.post(`http://localhost:3000/lobby/resetRoles/${lobbyId}`, {
        lobbyId,
      });

      console.log("Ролі скинуто");
    } catch (err) {
      console.error("Помилка скидання ролей:", err);
    }
  };

  const assignRoles = async (lobbyId) => {
    try {
      await axios.post(`http://localhost:3000/lobby/assign-roles/${lobbyId}`, {
        lobbyId,
      });

      console.log("Ролі задано");
    } catch (err) {
      console.error("Помилка надсилання ролей:", err);
    }
  };

  const setUserNameColor = (status) => {
    switch (status) {
      case true:
        return "green";
      default:
        return "black";
    }
  };

  return (
    <div className="host_lobby_container">
      <div className="create_image_container">
        <h2>ОЧІКУВАННЯ ГРАВЦІВ</h2>
      </div>
      <div className="host_main_container">
        <div className="cheap_header">
          <div className="lobby_quantity">
            Гравців в лобі:{users.length}/{settings.playersNumber}
          </div>
          <div className="id_container">
            <div className="id_value">Код: {lobbyId}</div>
            <div className="id_copy">
              <p
                className="bc2"
                onClick={() => navigator.clipboard.writeText(lobbyId)}
              >
                Копіювати
              </p>
            </div>
          </div>
        </div>
        <div className="host_lobby_dashboard">
          <div className="users_dashboard">
            <div className="user_list">
              {users.map((user, index) => (
                <div
                  className="user_item"
                  key={index}
                  onClick={() => setSelectedUser(user)}
                >
                  <img
                    style={{
                      border: getBorderColorByRole(user.role),
                    }}
                    src={getAvatarUrl(user.avatarId)}
                    className="avatar"
                  ></img>
                  <div
                    className="player_name"
                    style={{
                      color: setUserNameColor(user.ready),
                    }}
                  >
                    {user.username.length > 10
                      ? user.username.substring(0, 10) + "..."
                      : user.username}
                  </div>
                </div>
              ))}
            </div>
            {selectedUser?.username && (
              <div className="selected_user_container">
                <div className="selected_user_info">
                  <div className="selected_user_avatar">
                    <img
                      style={{
                        border: getBorderColorByRole(selectedUser.role),
                      }}
                      src={getAvatarUrl(selectedUser.avatarId)}
                      className="avatar"
                    />
                    <div className="player_name">
                      {selectedUser.username.length > 10
                        ? selectedUser.username.substring(0, 10) + "..."
                        : selectedUser.username}
                    </div>
                  </div>
                  <div className="selected_user_settings">
                    <p>{selectedUser.role}</p>
                  </div>
                </div>
                <div className="selected_user_buttons">
                  <div></div>
                  <div></div>
                </div>
              </div>
            )}
          </div>
          <div className="options_menu">
            <div className="options_header">Додаткові налаштування</div>
            <div className="options_grid_containers">
              <div className="options_item"></div>
              <div className="options_item">
                <Button onClick={() => resetRoles(lobbyId)} variant="primary">
                  {" "}
                  Скинути ролі
                </Button>
              </div>
              <div className="options_item">
                <Button onClick={() => assignRoles(lobbyId)} variant="primary">
                  {" "}
                  Розподілити ролі
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
