import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CharacterListPage from "./pages/CharacterListPage";
import CharacterPage from "./pages/CharacterPage";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<CharacterListPage />} />
          <Route path="/:characterID" element={<CharacterPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
