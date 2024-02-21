import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import InlineClassListComp from "./InlineClassListComp";

// Show user preliminary details about each character
const CharacterListComp = ({ characters }) => {
  const [avatarURLs, setAvatarURLs] = useState();

  useEffect(() => {
    const loadAvatarURLs = async () => {
      const newImgURLs = [];
      for (const character of characters) {
        try {
          const imgBlob = await axios.get(
            `/api/img/char/${character.avatarId}`,
            {
              responseType: "blob",
            }
          );
          newImgURLs.push(URL.createObjectURL(imgBlob.data));
        } catch (error) {}
      }
      setAvatarURLs(newImgURLs);
    };

    loadAvatarURLs();
  }, [characters]);

  return (
    <div className="character-list">
      {characters.map((character, i) => (
        <Link
          key={`${character.id}`}
          className="character-list-link"
          to={`/${character.id}`}
        >
          <div className="character-list-info">
            <div className="avatar-label">
              <h2>{character.name}</h2>
              <InlineClassListComp classes={character.classes} />
            </div>
            <img
              src={avatarURLs[i]}
              alt="Avatar"
              className="avatar avatar-container"
            ></img>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CharacterListComp;
