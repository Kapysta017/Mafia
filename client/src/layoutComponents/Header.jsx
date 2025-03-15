import { colors } from "@mui/material";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";

export function Header() {
  const theme = useTheme();
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
          <Button
            href="/start"
            variant="contained"
            sx={{ bgcolor: "ochre.action" }}
          >
            Start Game
          </Button>
        </div>
      </div>
    </header>
  );
}
