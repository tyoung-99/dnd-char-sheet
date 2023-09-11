import { readFile } from "fs/promises";

const getCharacters = async () => {
  const characters = JSON.parse(
    await readFile("./src/sample-content/characters.json")
  );

  return characters;
};

export default getCharacters;
