import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layoutComponents/Layout";
function Home() {
  return <h1>Головна сторінка</h1>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
