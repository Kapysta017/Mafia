import { Button } from "../../components/Button";
import { useNavigate } from "react-router-dom";
export function StartGamePage() {
  const navigate = useNavigate();
  const handleClick = (path) => {
    navigate(`/${path}`);
  };
  return (
    <div className="start_container">
      <h1>Обрати режим</h1>
      <main>
        <div className="container_element">
          <div className="image">image</div>
          <div className="text"> text</div>
          <div className="button_container">
            <Button
              variant="primary"
              size="large"
              onClick={() => handleClick("create")}
            >
              Create Game
            </Button>
          </div>
        </div>
        <div className="container_element">
          <div className="image">image</div>
          <div className="text"> text</div>
          <div className="join_button_container">
            <input type="text" placeholder="Введіть код"></input>
            <Button variant="primary" size="small" disabled>
              Join
            </Button>
          </div>
        </div>
        <div className="container_element">
          <div className="image">image</div>
          <div className="text"> text</div>
          <div className="button_container">
            <Button
              variant="primary"
              size="large"
              onClick={() => handleClick("list")}
            >
              Browse List
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
