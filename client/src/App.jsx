import "./App.scss";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./colorThemes/theme";
import { Home } from "./view/home/Home";
import { StartGamePage } from "./view/start/StartGame";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./layoutComponents/Layout";

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/start" element={<StartGamePage />} />
          </Routes>
        </Layout>
      </ThemeProvider>
    </Router>
  );
}

export default App;
