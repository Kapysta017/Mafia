import axios from "axios";
import { Button } from "./Button";
import { RoleButton } from "./RoleButton";
import { useEffect, useState } from "react";
export function StatusButton({
  lobbyId,
  settings,
  state,
  isReady,
  setIsReady,
  user,
  selectedUser,
}) {
  const [hasVoted, setHasVoted] = useState(false);
  const [hasPressedReadyToVote, setHasPressedReadyToVote] = useState(false);
  const ableToVote = user?.alive;

  useEffect(() => {
    setHasVoted(false);
    setHasPressedReadyToVote(false);
  }, [state.currentState]);

  const handleAction = async () => {
    await axios.post(`http://localhost:3000/lobby/${lobbyId}/performAction`, {
      playerId: user.id,
      targetId: selectedUser.id,
    });
  };
  const handleReadyToVote = async () => {
    await axios.patch(`http://localhost:3000/lobby/${lobbyId}/readyToVote`, {
      id: user.id,
    });
    setHasPressedReadyToVote(true);
  };

  const handleVote = async () => {
    await axios.post(`http://localhost:3000/lobby/${lobbyId}/vote`, {
      playerId: user.id,
      targetId: selectedUser.id,
    });
    setHasVoted(true);
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
            onClick={() => handleReadyToVote()}
            disabled={!ableToVote || hasPressedReadyToVote}
            variant="secondary"
            size="medium"
          >
            Розпочати Голосування
          </Button>
        </div>
      );
    case "voting":
      return (
        <div className="ready_button">
          <Button
            disabled={!ableToVote || hasVoted}
            onClick={() => handleVote()}
            variant="secondary"
            size="medium"
          >
            Проголосувати
          </Button>
        </div>
      );
  }
}
