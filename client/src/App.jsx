import "./App.scss";
import { Home } from "./view/home/Home";
import { StartGamePage } from "./view/start/StartGamePage";
import { CreateGamePage } from "./view/create/CreateGamePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./layoutComponents/Layout";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/start" element={<StartGamePage />} />
          <Route path="/create" element={<CreateGamePage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
