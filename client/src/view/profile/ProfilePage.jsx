import { useState } from "react";
import { Button } from "../../components/Button";

export function ProfilePage() {
  const [profileName, setProfileName] = useState("");
  const handleChange = (event) => {
    setProfileName(event.target.value);
  };
  const handleClick = () => {
    localStorage.setItem("profileName", profileName);
    console.log("Ім'я збережене:", profileName);
  };
  return (
    <>
      <div>профілепадже</div>
      <input
        type="text"
        placeholder="Введіть ім'я"
        value={profileName}
        onChange={handleChange}
      />
      <Button variant="primary" onClick={handleClick}>
        Підтвердити
      </Button>
    </>
  );
}
