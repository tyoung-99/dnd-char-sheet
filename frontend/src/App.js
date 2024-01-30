import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CharacterListPage from "./pages/CharacterListPage";
import CharacterPage from "./pages/CharacterPage";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<CharacterListPage />} />
          <Route path="/:characterID" element={<CharacterPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
