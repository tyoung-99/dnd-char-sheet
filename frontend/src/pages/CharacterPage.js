import { useParams } from "react-router-dom";
import characters from "../sample-data/CharactersContentSample";
import InlineClassListComp from "../components/InlineClassListComp";

// Full character sheet
const CharacterPage = () => {
  const { characterID } = useParams();
  const character = characters.find(
    (character) => character.id === parseInt(characterID)
  );
  return (
    <>
      <h1>{character.name}</h1>
      <h2>{character.player}</h2>
      <InlineClassListComp classes={character.classes} />
      <p>{character.backstory}</p>
    </>
  );
};

export default CharacterPage;
