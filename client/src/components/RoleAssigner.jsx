import { useState } from "react";
import { initialRoles } from "../utils/roles";
export function RoleAssigner({ children, playersNumber, mafiaNumber }) {
  const [roles, setRoles] = useState(initialRoles);
  const toggleRole = (index) => {
    const updatedRoles = [...roles];
    updatedRoles[index].status = !updatedRoles[index].status;
    setRoles(updatedRoles);
  };
  return (
    <div className="roles_window">
      <div className="role_header">
        <p>Оберіть ролі:</p>
        {children}
      </div>
      <div className="roles_container">
        {roles.map((role, index) => (
          <div
            key={role.roleName}
            className={`role_item ${role.status ? "active" : ""} ${!role.avaible ? "disabled" : ""}`}
            onClick={() => {
              if (role.avaible) toggleRole(index);
            }}
          >
            {role.roleName}
          </div>
        ))}
      </div>
    </div>
  );
}
