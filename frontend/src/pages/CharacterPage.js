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
  const {
    editing,
    toggleEditing,
    updateCharacter,
    saveCharacter,
    savePending,
  } = useCharacter(character, setCharacter);

  useEffect(() => {
    const loadCharacter = async () => {
      const response = await axios.get(`/api/characters/${characterID}`);
      setCharacter(response.data);
    };

    loadCharacter();
  }, [characterID, setCharacter]);

  const [prompt, setPrompt] = useState(0);

  const promptHeader = () => {
    setPrompt(prompt + 1);
  };

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
        {savePending ? <button onClick={saveCharacter}>Save</button> : null}
      </div>
      <div className="name-header">
        <h1>{character.name}</h1>
        {character.alignment ? <p>{character.alignment} </p> : null}
        {character.race.name ? (
          <p>
            {character.race.name}{" "}
            {character.race.subrace ? `(${character.race.subrace}) ` : ""}
          </p>
        ) : null}
        <InlineClassListComp classes={character.classes} />
      </div>
      {editing ? (
        <CharacterPageEdit
          character={character}
          updateCharacter={updateCharacter}
          promptHeader={promptHeader}
        />
      ) : (
        <CharacterPagePlay character={character} />
      )}
    </>
  );
};
export default CharacterPage;
