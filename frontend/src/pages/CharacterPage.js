import { useParams } from "react-router-dom";
import characters from "../sample-data/CharactersContentSample";

// Full character sheet
const CharacterPage = () => {
  const { characterID } = useParams();
  const character = characters.find(
    (character) => character.id === parseInt(characterID)
  );
  return (
    <>
      <h1>{character.name}</h1>
      <p>{character.player}</p>
      <p>{character.backstory}</p>
    </>
  );
};

export default CharacterPage;
