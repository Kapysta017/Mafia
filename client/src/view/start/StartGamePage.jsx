import { Button } from "../../components/Button";
import { useNavigate } from "react-router-dom";
export function StartGamePage() {
  const navigate = useNavigate();
  const handleClick = (path) => {
    navigate(`/${path}`);
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
            <input type="text" placeholder="Введіть код"></input>
            <Button variant="primary" size="small" disabled>
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
