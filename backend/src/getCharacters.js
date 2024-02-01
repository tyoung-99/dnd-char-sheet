import { readFile } from "fs/promises";

const getCharacters = async () => {
  let characters = JSON.parse(await readFile("data/characters.json"));
  return characters;
};

export default getCharacters;
