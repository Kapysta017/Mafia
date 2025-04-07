import { useState, useEffect } from "react";
import { Button } from "../../components/Button";
import { avatars } from "../../utils/avatars";

export function ProfilePage() {
  const [profileName, setProfileName] = useState("");
  const [selectedAvatarId, setSelectedAvatarId] = useState("");
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const handleChange = (event) => {
    setProfileName(event.target.value);
  };

  const handleClick = () => {
    localStorage.setItem("profileName", profileName);
    localStorage.setItem("profileAvatarId", selectedAvatarId);
  };
  const toggleAvatarModal = () => {
    setIsAvatarModalOpen(!isAvatarModalOpen);
  };
  const onSelect = (id) => {
    setSelectedAvatarId(id);
    setIsAvatarModalOpen(false);
  };
  useEffect(() => {
    const savedName = localStorage.getItem("profileName");
    const savedAvatarId = localStorage.getItem("profileAvatarId");
    if (savedName) {
      setProfileName(savedName);
    }
    if (savedAvatarId) {
      setSelectedAvatarId(savedAvatarId);
    }
  }, []);
  const selectedAvatar = avatars.find((a) => a.id === Number(selectedAvatarId));
  return (
    <div className="profile_page_container">
      <h2>ОСОБИСТИЙ КАБІНЕТ</h2>

      <div className="info_container">
        <img src={selectedAvatar?.url} className="avatar"></img>
        <div className="change_button" onClick={toggleAvatarModal}>
          {" "}
          <div className="edit_icon"></div>
          <p className="bc2">змінити аватар</p>{" "}
        </div>
        <div className="profile_name"></div>
        <div className="change_button">
          {" "}
          <div className="edit_icon"></div>
          <p className="bc2">змінити нікнейм</p>
        </div>
        <Button variant="secondary" onClick={handleClick}>
          Підтвердити
        </Button>
      </div>
      <input
        type="text"
        placeholder="Введіть ім'я"
        value={profileName}
        onChange={handleChange}
      />
      {isAvatarModalOpen && (
        <div className="avatar_modal">
          <h4>Оберіть аватар:</h4>
          <div className="avatar_grid">
            {avatars.map((avatar, index) => (
              <img
                key={index}
                src={avatar.url}
                alt={`avatar-${index}`}
                className="avatar_option"
                onClick={() => onSelect(avatar.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
