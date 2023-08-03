// Full character sheet

import "../styling/CharacterPage.css";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import InlineClassListComp from "../components/InlineClassListComp";
import CharacterPagePlay from "./CharacterPagePlay";
import CharacterPageEdit from "./CharacterPageEdit";
import useCharacter from "../hooks/useCharacter";

const CharacterPage = () => {
  const { characterID } = useParams();
  const [character, setCharacter] = useState();
  const { editing, toggleEditing, saveCharacter } = useCharacter({
    character,
    setCharacter,
  });

  useEffect(() => {
    const loadCharacter = async () => {
      const response = await axios.get(`/api/characters/${characterID}`);
      setCharacter(response.data);
    };

    loadCharacter();
  }, [characterID, setCharacter]);

  if (!character) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="general-buttons">
        <Link to={"/"}>
          <button>Back to List</button>
        </Link>
        <button onClick={toggleEditing}>
          {editing ? "View Character" : "Edit Character"}
        </button>
      </div>
      <div className="name-header">
        <h1>{character.name}</h1>
        <p>{character.alignment}</p>
        <p>
          {character.race.name}{" "}
          {character.race.subrace !== null ? `(${character.race.subrace})` : ""}
        </p>
        <InlineClassListComp classes={character.classes} />
      </div>
      {editing ? (
        <CharacterPageEdit
          character={character}
          saveCharacter={saveCharacter}
        />
      ) : (
        <CharacterPagePlay character={character} />
      )}
    </>
  );
};
export default CharacterPage;
