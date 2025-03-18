import "./App.scss";
import { HomePage } from "./view/home/HomePage";
import { StartGamePage } from "./view/start/StartGamePage";
import { CreateGamePage } from "./view/create/CreateGamePage";
import { BrowsePage } from "./view/join/BrowsePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./layout/Layout";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/start" element={<StartGamePage />} />
          <Route path="/create" element={<CreateGamePage />} />
          <Route path="/list" element={<BrowsePage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
