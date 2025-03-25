import "./App.scss";
import { HomePage } from "./view/home/HomePage";
import { StartGamePage } from "./view/start/StartGamePage";
import { CreateGamePage } from "./view/create/CreateGamePage";
import { BrowsePage } from "./view/join/BrowsePage";
import { ProfilePage } from "./view/profile/ProfilePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./layout/Layout";
import { LobbyAwainting } from "./view/game/LobbyAwaiting";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/start" element={<StartGamePage />} />
          <Route path="/create" element={<CreateGamePage />} />
          <Route path="/list" element={<BrowsePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/lobby/:lobbyId" element={<LobbyAwainting />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
