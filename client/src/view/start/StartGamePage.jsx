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
          <div className="create">
            <div className="image">image</div>
            <div className="text"> text</div>
            <Button
              variant="action"
              size="large"
              onClick={() => handleClick("create")}
            >
              Create Game
            </Button>
          </div>
        </div>
        <div className="container_element">
          <div className="join">
            <div className="image">image</div>
            <div className="text"> text</div>
            <div className="button"> button</div>
          </div>
        </div>
        <div className="container_element">
          <div className="browse">
            <div className="image">image</div>
            <div className="text"> text</div>
            <div className="button"> button</div>
          </div>
        </div>
      </main>
    </div>
  );
}
