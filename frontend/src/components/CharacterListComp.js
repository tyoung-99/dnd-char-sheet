import { Link } from "react-router-dom";
import InlineClassListComp from "./InlineClassListComp";

// Show user preliminary details about each character
const CharacterListComp = ({ characters }) => {
  return (
    <div>
      {characters.map((character) => (
        <Link
          key={`${character.id}`}
          className="character-list-item"
          to={`/${character.id}`}
        >
          <div>
            <div className="avatar-label">
              <h2>{character.name}</h2>
              <InlineClassListComp classes={character.classes} />
            </div>
            <img
              src={process.env.PUBLIC_URL + `/img/${character.avatarSrc}`}
              alt="Avatar"
              className="avatar"
            ></img>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CharacterListComp;
