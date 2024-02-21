import { readFile } from "fs/promises";

export const getRaces = async () => {
  const races = JSON.parse(await readFile("data/races.json"));
  return races.map((race) => race.name);
};

export const getRaceSrcbooks = async (raceName) => {
  const races = JSON.parse(await readFile("data/races.json"));
  try {
    return races
      .find((race) => race.name === raceName)
      .srcBooks.map((book) => book.name);
  } catch (error) {
    return [];
  }
};

export const getRaceFeatures = async (raceName, raceSrcBook) => {
  const races = JSON.parse(await readFile("data/races.json"));
  try {
    return races
      .find((race) => race.name === raceName)
      .srcBooks.find((book) => book.name === raceSrcBook).features;
  } catch (error) {
    return [];
  }
};

export const getSubraces = async (raceName, raceSrcBook) => {
  const races = JSON.parse(await readFile("data/races.json"));
  try {
    return races
      .find((race) => race.name === raceName)
      .srcBooks.find((book) => book.name === raceSrcBook)
      .subraces.map((subrace) => subrace.name);
  } catch (error) {
    return [];
  }
};

export const getSubraceSrcbooks = async (
  raceName,
  raceSrcBook,
  subraceName
) => {
  const races = JSON.parse(await readFile("data/races.json"));
  try {
    return races
      .find((race) => race.name === raceName)
      .srcBooks.find((book) => book.name === raceSrcBook)
      .subraces.find((subrace) => subrace.name === subraceName)
      .srcBooks.map((book) => book.name);
  } catch (error) {
    return [];
  }
};

export const getSubraceFeatures = async (
  raceName,
  raceSrcBook,
  subraceName,
  subraceSrcBook
) => {
  const races = JSON.parse(await readFile("data/races.json"));
  try {
    return races
      .find((race) => race.name === raceName)
      .srcBooks.find((book) => book.name === raceSrcBook)
      .subraces.find((subrace) => subrace.name === subraceName)
      .srcBooks.find((book) => book.name === subraceSrcBook).features;
  } catch (error) {
    return [];
  }
};
