import { BrowserRouter, Routes, Route } from "react-router-dom"
import Test from "./pages/Test.jsx"
import './App.css'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Test />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App
