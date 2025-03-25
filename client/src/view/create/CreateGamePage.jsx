import { useState } from "react";
import axios from "axios";
import { Button } from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
const API_URL = "http://localhost:3000/lobby";

export function CreateGamePage() {
  const [username, setUsername] = useState("");
  useEffect(() => {
    setUsername(localStorage.getItem("profileName"));
  }, []);
  const navigate = useNavigate();

  const createLobby = async () => {
    try {
      const response = await axios.post(`${API_URL}/create`, {
        hostName: username,
      });
      const lobbyId = response.data;
      navigate(`/lobby/${lobbyId}`);
    } catch (error) {
      console.error("Помилка створення лобі:", error);
    }
  };

  return (
    <main className="create_page_container">
      <div className="create_image_container">
        <h2>СТВОРЕННЯ ПРИВАТНОГО СТОЛУ</h2>
      </div>
      <div className="page_content">
        <div className="settings_dashboard">
          <p>Назва столу:</p>
          <input type="text" placeholder="Введіть назву столу"></input>
          <p>Кількість гравців:</p>
          <Button variant="primary" size="small" />
          <p>Кількість мафій:</p>
          <Button variant="primary" size="small" />
        </div>
        <div className="table"></div>
      </div>
      <div className="go_next_button">
        <Button onClick={createLobby} variant="primary" size="medium">
          Вперед
        </Button>
      </div>
    </main>
  );
}
