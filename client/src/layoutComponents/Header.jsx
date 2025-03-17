import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";
export function Header() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/start");
  };
  return (
    <header>
      <div className="header_container">
        <div className="container_grid_element">
          <Link to={"/"}>Мафія Онлайн</Link>
        </div>
        <div className="header_container">
          <div className="container_grid_element">Про сайт</div>
          <div className="container_grid_element">Правила</div>
          <div className="container_grid_element">Донат</div>
        </div>
        <div className="container_grid_element">
          <Button variant="action" size="medium" onClick={handleClick}>
            Start Game
          </Button>
        </div>
      </div>
    </header>
  );
}
