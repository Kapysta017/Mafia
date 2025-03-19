import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";
export function Header() {
  const navigate = useNavigate();
  const handleClick = (path) => {
    navigate(`${path}`);
  };
  return (
    <header>
      <div className="header_container">
        <div className="container_grid_element">
          <Link to={"/"}>
            <div className="bc1">Мафія Онлайн</div>
          </Link>
        </div>
        <div className="header_container">
          <div className="container_grid_element">
            <p className="bc2">Про сайт</p>
          </div>
          <div className="container_grid_element">
            <p className="bc2">Правила</p>
          </div>
          <div className="container_grid_element">
            <p className="bc2">Донат</p>
          </div>
        </div>
        <div className="container_grid_element">
          <Button
            variant="action"
            size="medium"
            onClick={() => handleClick("start")}
          >
            Start Game
          </Button>
        </div>
      </div>
    </header>
  );
}
