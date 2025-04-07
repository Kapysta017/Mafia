import { Button } from "../../components/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

const API_URL = "http://localhost:3000/lobby";
export function StartGamePage() {
  const [username, setUsername] = useState("");
  const [lobbyId, setLobbyId] = useState("");
  const [avatarId, setAvatarId] = useState("");
  const [inputValue, setInputValue] = useState("");
  useEffect(() => {
    setUsername(localStorage.getItem("profileName"));
    setAvatarId(Number(localStorage.getItem("profileAvatarId")));
  }, []);

  const navigate = useNavigate();

  const handleChange = (event) => {
    setInputValue(event.target.value);
    setLobbyId(event.target.value);
  };

  const handleClick = (path) => {
    navigate(`/${path}`);
  };

  const joinLobby = async () => {
    try {
      const response = await axios.post(`${API_URL}/join/${lobbyId}`, {
        lobbyId: lobbyId,
        username: username,
        avatarId: avatarId,
      });
      if (response.data.success) {
        console.log("Гравець приєднався:", response.data.players);
        localStorage.removeItem("isHost");
        navigate(`/lobby/${lobbyId}`);
      } else {
        console.error("Помилка приєднання:", response.data.message);
      }
    } catch (err) {
      console.error("Помилка приєднання:", err);
    }
  };

  return (
    <div className="start_container">
      <h2>Обрати режим</h2>
      <main>
        <div className="container_element">
          <img className="image" src="/images/create_game.png" alt="Create" />
          <div className="text">
            <h3>Створити Гру</h3>
            <ul>
              <li className="bc2">Я заглушка 1</li>
              <li className="bc2">
                Я довга заглушка шоб побачити як буде виглядати
              </li>
              <li className="bc2">Я заглушка 3</li>
            </ul>
          </div>
          <div className="button_container">
            <Button
              variant="primary"
              size="medium"
              onClick={() => handleClick("create")}
            >
              Створити Гру
            </Button>
          </div>
        </div>
        <div className="container_element">
          <img className="image" src="/images/join_game.png" alt="Join" />
          <div className="text">
            {" "}
            <h3>Приєднатися До Гри</h3>
            <ul>
              <li className="bc2">Я заглушка 1</li>
              <li className="bc2">
                Я довга заглушка шоб побачити як буде виглядати
              </li>
              <li className="bc2">Я заглушка 3</li>
            </ul>
          </div>
          <div className="join_button_container">
            <input
              onChange={handleChange}
              value={lobbyId}
              type="text"
              placeholder="Введіть код"
            ></input>
            <Button
              variant="primary"
              size="small"
              disabled={!inputValue.trim()}
              onClick={joinLobby}
            >
              {`>`}
            </Button>
          </div>
        </div>
        <div className="container_element">
          <img className="image" src="/images/browse_list.png" alt="Browse" />
          <div className="text">
            {" "}
            <h3>Список Ігрових Сесій</h3>
            <ul>
              <li className="bc2">Я заглушка 1</li>
              <li className="bc2">
                Я довга заглушка шоб побачити як буде виглядати
              </li>
              <li className="bc2">Я заглушка 3</li>
            </ul>
          </div>
          <div className="button_container">
            <Button
              variant="primary"
              size="medium"
              onClick={() => handleClick("list")}
            >
              Переглянути Список
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
