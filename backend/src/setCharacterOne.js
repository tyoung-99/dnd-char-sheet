import { writeFile } from "fs/promises";
import getCharacters from "./getCharacters.js";

const setCharacterOne = async (id, newChar) => {
  const characters = await getCharacters();

  const characterIndex = characters.findIndex(
    (character) => character.id === id
  );

  if (characterIndex >= 0) {
    characters[characterIndex] = newChar;
    try {
      await writeFile(
        "./src/sample-content/characters.json",
        JSON.stringify(characters)
      );
    } catch (error) {
      return "Couldn't write character to characters.json.";
    }
    return "Character successfully updated.";
  } else {
    return "Character doesn't exist.";
  }
};

export default setCharacterOne;
