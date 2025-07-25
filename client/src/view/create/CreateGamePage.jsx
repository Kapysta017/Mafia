import { useState } from "react";
import axios from "axios";
import { Button } from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { PlayersCounter } from "../../components/PlayersCounter";
import { MafiaCounter } from "../../components/MafiaCounter";
import { Table } from "../../components/Table";
import { initialRoles } from "../../utils/roles";
import { RoleAssigner } from "../../components/RoleAssigner";
const API_URL = "http://localhost:3000/lobby";

export function CreateGamePage() {
  const [roles, setRoles] = useState(initialRoles);
  const [aiAnswer, setAiAnswer] = useState(false);
  const [privateAnswer, setPrivateAnswer] = useState(false);
  const [username, setUsername] = useState("");
  const [avatarId, setAvatarId] = useState("");
  const [playersNumber, setPlayersNumber] = useState(4);
  const [mafiaNumber, setMafiaNumber] = useState(1);
  const [isRolesWindowOpen, setisRolesWindowOpen] = useState(false);

  useEffect(() => {
    setUsername(localStorage.getItem("profileName"));
    setAvatarId(Number(localStorage.getItem("profileAvatarId")));
  }, []);

  const navigate = useNavigate();

  const createLobby = async () => {
    try {
      const response = await axios.post(`${API_URL}/createLobby`, {
        hostName: username,
        avatarId,
        playersNumber,
        mafiaNumber,
        aiAnswer,
      });
      const lobbyId = response.data;
      try {
        await axios.patch(
          `http://localhost:3000/lobby/${lobbyId}/updateRoles`,
          {
            roles,
          }
        );
      } catch (err) {
        console.error("Помилка надсилання ролей:", err);
      }
      sessionStorage.setItem("isHost", "true");
      sessionStorage.setItem("id", 1);
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
          <PlayersCounter
            playersNumber={playersNumber}
            setPlayersNumber={setPlayersNumber}
            mafiaNumber={mafiaNumber}
            setMafiaNumber={setMafiaNumber}
          ></PlayersCounter>
          <p>Кількість мафій:</p>
          <MafiaCounter
            playersNumber={playersNumber}
            mafiaNumber={mafiaNumber}
            setMafiaNumber={setMafiaNumber}
          ></MafiaCounter>
          <p>ШІ ведучий:</p>
          <div className="round_button_container">
            <Button
              onClick={() => setAiAnswer((prev) => !prev)}
              variant="round"
            >
              {aiAnswer ? "✓" : "\u200B"}
            </Button>
          </div>
          <p>Приватний стіл:</p>
          <div className="round_button_container">
            <Button
              onClick={() => setPrivateAnswer((prev) => !prev)}
              variant="round"
            >
              {privateAnswer ? "✓" : "\u200B"}
            </Button>
          </div>
          <p>Ролі:</p>
          <div className="round_button_container">
            <Button
              variant="round"
              onClick={() => setisRolesWindowOpen(!isRolesWindowOpen)}
            >
              <img className="search_icon" src="/icons/search.png"></img>
            </Button>
          </div>
        </div>
        <Table playersNumber={playersNumber} mafiaNumber={mafiaNumber}></Table>
      </div>
      <div className="go_next_button">
        <Button onClick={createLobby} variant="primary" size="medium">
          Вперед
        </Button>
      </div>
      {isRolesWindowOpen && (
        <RoleAssigner playersNumber={playersNumber} mafiaNumber={mafiaNumber}>
          <Button
            variant="round"
            onClick={() => setisRolesWindowOpen(!isRolesWindowOpen)}
          >
            X
          </Button>
        </RoleAssigner>
      )}
    </main>
  );
}
