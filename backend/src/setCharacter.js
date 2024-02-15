import { writeFile } from "fs/promises";
import getCharacters from "./getCharacters.js";

const setCharacter = async (id, newChar) => {
  const characters = await getCharacters();
  const charIndex = characters.findIndex((char) => char.id === id);

  if (charIndex < 0)
    return { success: false, reason: "Character doesn't exist." };
  characters[charIndex] = newChar;
  try {
    await writeFile("data/characters.json", JSON.stringify(characters));
  } catch (error) {
    return { success: false, reason: "Couldn't write to characters file." };
  }
  return { success: true };
};

export default setCharacter;