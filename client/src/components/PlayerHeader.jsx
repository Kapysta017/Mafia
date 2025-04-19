export function PlayerHeader({ state }) {
  let message;
  switch (state) {
    case "night":
      return (
        <div className="rules_active">
          <div className="day_counter">День: 1</div>
          <div className="game_state">
            <h3>МІСТО СПИТЬ</h3>
          </div>
          <div className="player_counter">Живих гравців:12/12</div>
        </div>
      );
    case "day":
      return (
        <div className="rules_active">
          <div className="day_counter">День: 1</div>
          <div className="game_state">
            <h3>МІСТО ПРОКИДАЄТЬСЯ</h3>
          </div>
          <div className="player_counter">Живих гравців:12/12</div>
        </div>
      );
    default:
      return null;
  }
}
