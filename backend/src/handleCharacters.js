import { readFile, writeFile } from "fs/promises";

export const getCharacters = async (db) => {
  // specifically for the mongodb find method, you must seperate the collection and find method on two lines
  const collection = db.collection('characters');
  const characters = await collection.find({}).toArray();
  return characters;
};


export const getOneCharacter = async (db, id) => {
  const char = await db.collection('characters').findOne({ "id": id });
  return char;
};

export const setCharacter = async (db, id, newChar) => {
  try {
    await db.collection('characters').updateOne({ "id": id }, newChar);
  } catch (error) {
    return { success: false, reason: "Couldn't write to characters file." };
  }
  
  return { success: true };
};
