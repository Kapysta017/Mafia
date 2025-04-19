import { Button } from "./Button";
import { RoleButton } from "./RoleButton";
export function StatusButton({
  state,
  isReady,
  setIsReady,
  user,
  selectedUser,
}) {
  switch (state) {
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
          selectedUser={selectedUser.username}
        ></RoleButton>
      );
  }
}
