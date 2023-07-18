import { Link } from "react-router-dom";

// Show user preliminary details about characters in list
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
          <p>{character.player}</p>
        </Link>
      ))}
    </>
  );
};

export default CharacterListComp;
