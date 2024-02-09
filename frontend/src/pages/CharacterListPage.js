import "../styling/pages/CharacterListPage.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Character from "../Character";
import CharacterListComp from "../components/CharacterListComp";

// Show user preliminary details about their characters
const CharacterListPage = () => {
  const [charList, setCharList] = useState([]);

  useEffect(() => {
    const loadCharList = async () => {
      const response = await axios.get("/api/characters");
      const newCharList = response.data.map((char) =>
        Object.assign(new Character(), char)
      );
      setCharList(newCharList);
    };

    loadCharList();
  }, []);

  if (!charList) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1>Characters</h1>
      <CharacterListComp characters={charList} />
    </>
  );
};

export default CharacterListPage;
