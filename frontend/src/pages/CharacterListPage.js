import "../styling/CharacterListPage.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import CharacterListComp from "../components/CharacterListComp";

// Show user preliminary details about their characters
const CharacterListPage = () => {
  const [charList, setCharList] = useState([]);

  useEffect(() => {
    const loadCharList = async () => {
      const response = await axios.get("/api/characters");
      setCharList(response.data);
    };

    loadCharList();
  }, []);

  if (!charList) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Link to={"admin"}>Admin</Link>
      <h1>Characters</h1>
      <CharacterListComp characters={charList} />
    </>
  );
};

export default CharacterListPage;
