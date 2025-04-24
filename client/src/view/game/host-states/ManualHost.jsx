import { PlayerHeader } from "../../../components/PlayerHeader";
import { avatars } from "../../../utils/avatars";
export function ManualHost({ settings, host, users, state, aiAnswer }) {
  const getAvatarUrl = (avatarId) => {
    const avatar = avatars.find((avatar) => avatar.id === avatarId);
    return avatar ? avatar.url : "/avatars/default.png";
  };
  return (
    <div className="host_lobby_container">
      <h2>Приватний стіл: {host.username}</h2>
      <PlayerHeader state={{ state }}></PlayerHeader>
      <div className="host_main_container">
        <div className="host_lobby_dashboard">
          <div className="users_dashboard">
            <div className="user_list">
              {users.map((user, index) => (
                <div className="user_item" key={index}>
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
            <div className="selected_user_container">
              <div className="selected_user_info"></div>
            </div>
          </div>
          <div className="options_menu">
            <div className="options_header">Тут буде чат</div>
          </div>
        </div>
      </div>
    </div>
  );
}
