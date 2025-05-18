import { avatars } from "../../utils/avatars";
export function EndScreen({ settings, state, users }) {
  const usedRoles = settings.roles.map((roleObj) => roleObj.roleName);
  const peacefulPlayers = users.filter((u) => !usedRoles.includes(u.role));
  const getAvatarUrl = (avatarId) => {
    const avatar = avatars.find((avatar) => avatar.id === avatarId);
    return avatar ? avatar.url : "/avatars/default.png";
  };
  return (
    <div className="end_page_container">
      <h2>Переможці: {state.winner}</h2>
      <div className="end_page_grid">
        {settings.roles.map((roleObj) => {
          const roleName = roleObj.roleName;
          const playersWithRole = users.filter((u) => u.role === roleName);

          return (
            <div key={roleName} className="role_container">
              <div className="role_info">{roleName}:</div>
              <div className="players_list">
                {playersWithRole.map((player) => (
                  <div key={player.id} className="player_avatar">
                    <img
                      src={getAvatarUrl(player.avatarId)}
                      className="avatar"
                    />
                    <div className="hf">{player.username}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {peacefulPlayers.length > 0 && (
          <div className="role_container">
            <div className="role_info">Громадяни:</div>
            <div className="players_list">
              {peacefulPlayers.map((player) => (
                <div key={player.id} className="player_avatar">
                  <img src={getAvatarUrl(player.avatarId)} className="avatar" />
                  <div className="hf">{player.username}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
