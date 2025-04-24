import axios from "axios";
import { Button } from "./Button";
import { RoleButton } from "./RoleButton";
import { use } from "react";
export function StatusButton({
  lobbyId,
  settings,
  state,
  isReady,
  setIsReady,
  user,
  selectedUser,
}) {
  const hasVoted = state.readyToVote?.includes(user.username);

  const handleAction = async () => {
    await axios.post(`http://localhost:3000/lobby/${lobbyId}/performAction`, {
      playerId: user.id,
      targetId: selectedUser.id,
    });
  };
  const handleVote = async () => {
    await axios.patch(`http://localhost:3000/lobby/${lobbyId}/readyToVote`, {
      id: user.id,
    });
  };
  switch (state.currentState) {
    case "waiting":
      return (
        <div className="ready_status">
          {isReady ? (
            <div
              className="status"
              style={{
                color: "green",
              }}
            >
              ✓
            </div>
          ) : (
            <div
              className="status"
              style={{
                color: "red",
              }}
            >
              X
            </div>
          )}
          <div className="ready_button">
            <Button
              onClick={() => setIsReady((prev) => !prev)}
              variant="secondary"
              size="medium"
            >
              Готовий
            </Button>
          </div>
        </div>
      );
    case "night":
      return (
        <RoleButton
          role={user.role}
          state={state}
          handleAction={handleAction}
        ></RoleButton>
      );
    case "day":
      return (
        <div className="ready_button">
          <Button
            onClick={() => handleVote()}
            disabled={hasVoted}
            variant="secondary"
            size="medium"
          >
            Розпочати Голосування
          </Button>
        </div>
      );
  }
}
