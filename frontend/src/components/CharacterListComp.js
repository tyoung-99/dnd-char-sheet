import { Link } from "react-router-dom";
import InlineClassListComp from "./InlineClassListComp";

// Show user preliminary details about each character
const CharacterListComp = ({ characters }) => {
  return (
    <>
      {characters.map((character) => (
        <Link
          key={`${character.id}`}
          className="character-list-item"
          to={`/${character.id}`}
        >
          <h2>{character.name}</h2>
          <InlineClassListComp classes={character.classes} />
        </Link>
      ))}
    </>
  );
};

export default CharacterListComp;
