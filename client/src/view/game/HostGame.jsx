import { ManualHost } from "./host-states/ManualHost";
import { PlayerLobby } from "./PlayerLobby";
export function HostGame({ settings, host, users, state, aiAnswer }) {
  {
    return aiAnswer ? (
      <PlayerLobby host={host} users={users} state={state}></PlayerLobby>
    ) : (
      <ManualHost
        settings={settings}
        host={host}
        users={users}
        state={state}
        aiAnswer={aiAnswer}
      ></ManualHost>
    );
  }
}
