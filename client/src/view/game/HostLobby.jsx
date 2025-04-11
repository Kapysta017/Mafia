import { useEffect, useState } from "react";
import { avatars } from "../../utils/avatars";
import { useParams } from "react-router-dom";
export function HostLobby({ settings, host, users }) {
  let params = useParams();
  const [selectedUser, setSelectedUser] = useState({});
  useEffect(() => {
    if (host) setSelectedUser(host);
  }, [host]);
  const getAvatarUrl = (avatarId) => {
    const avatar = avatars.find((avatar) => avatar.id === avatarId);
    return avatar ? avatar.url : "/avatars/default.png";
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
            <div className="id_value">Код: {params.lobbyId}</div>
            <div className="id_copy">
              <p
                className="bc2"
                onClick={() => navigator.clipboard.writeText(params.lobbyId)}
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
                    src={getAvatarUrl(user.avatarId)}
                    className="avatar"
                  ></img>
                  <div className="player_name">
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
                      src={getAvatarUrl(selectedUser.avatarId)}
                      className="avatar"
                    />
                    <div className="player_name">
                      {selectedUser.username.length > 10
                        ? selectedUser.username.substring(0, 10) + "..."
                        : selectedUser.username}
                    </div>
                  </div>
                  <div className="selected_user_settings"></div>
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
              <div className="options_item"></div>
              <div className="options_item"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
