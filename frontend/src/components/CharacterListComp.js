import { Link } from "react-router-dom";
import InlineClassListComp from "./InlineClassListComp";

// Show user preliminary details about each character
const CharacterListComp = ({ characters }) => {
  return (
    <>
      {characters.map((character) => (
        <Link
          key={`${character.id}`}
          className="character-list-item avatar-holder"
          to={`/${character.id}`}
        >
          <div className="avatar-label">
            <h2>{character.name}</h2>
            <InlineClassListComp classes={character.classes} />
          </div>
          <img
            src={process.env.PUBLIC_URL + `/img/${character.avatarSrc}`}
            alt="Avatar"
            className="avatar"
          ></img>
        </Link>
      ))}
    </>
  );
};

export default CharacterListComp;
