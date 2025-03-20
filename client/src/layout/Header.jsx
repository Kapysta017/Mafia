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
            <h4>Мафія Онлайн</h4>
          </Link>
        </div>
        <div className="header_container">
          <div className="container_grid_element">
            <Link to={"/"}>
              <p className="hf">Про сайт</p>
            </Link>
          </div>
          <div className="container_grid_element">
            <Link to={"/"}>
              <p className="hf">Правила</p>
            </Link>
          </div>
          <div className="container_grid_element">
            <Link to={"/"}>
              <p className="hf">Донат</p>
            </Link>
          </div>
        </div>
        <div className="container_grid_element">
          <div className="header_button_container">
            <Button
              variant="primary"
              size="small"
              onClick={() => handleClick("start")}
            >
              Почати гру
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
