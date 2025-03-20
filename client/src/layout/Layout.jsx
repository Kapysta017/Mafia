import { Header } from "./Header";
import { Link } from "react-router-dom";
export function Layout({ children }) {
  return (
    <div className="layout">
      <Header />
      <main className="content">{children}</main>
      <footer>
        <div className="footer_container">
          <div className="footer_name">
            <div className="name">
              <h4>МАФІЯ ОНЛАЙН</h4>
              <p className="hf">Мафія онлайн 2025</p>
            </div>
          </div>
          <div className="footer_links">
            <Link to={"/"}>
              <p className="hf">Про сайт</p>
            </Link>
            <Link to={"/"}>
              <p className="hf">Правила Гри</p>
            </Link>
            <Link to={"/"}>
              <p className="hf">Пожертвування</p>
            </Link>
            <Link to={"/"}>
              <p className="hf">Почати Гру</p>
            </Link>
            <Link to={"/"}>
              <p className="hf">Особистий Кабінет</p>
            </Link>
            <Link to={"/"}>
              <p className="hf">Політика Конфіденційності</p>
            </Link>
            <Link to={"/"}>
              <p className="hf">Угода</p>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
