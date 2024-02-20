import { readFile } from "fs/promises";

export const getRaces = async () => {
  const races = JSON.parse(await readFile("data/races.json"));
  return ["Race1", "Race2"];
};

export const getRaceSrcbooks = async (raceName) => {
  const races = JSON.parse(await readFile("data/races.json"));
  return ["RaceSrc1", "RaceSrc2"];
};

export const getRaceFeatures = async (raceName, raceSrcBook) => {
  const races = JSON.parse(await readFile("data/races.json"));
  return [
    { name: "RaceFeat1", desc: ["RaceFeat1Desc"] },
    { name: "RaceFeat2", desc: ["RaceFeat2Desc"] },
  ];
};

export const getSubraces = async (raceName, raceSrcBook) => {
  const races = JSON.parse(await readFile("data/races.json"));
  return ["Subrace1", "Subrace2"];
};

export const getSubraceSrcbooks = async (
  raceName,
  raceSrcBook,
  subraceName
) => {
  const races = JSON.parse(await readFile("data/races.json"));
  return ["SubraceSrc1"];
};

export const getSubraceFeatures = async (
  raceName,
  raceSrcBook,
  subraceName,
  subraceSrcBook
) => {
  const races = JSON.parse(await readFile("data/races.json"));
  return [
    { name: "SubraceFeat1", desc: ["SubraceFeat1Desc"] },
    { name: "SubraceFeat2", desc: ["SubraceFeat2Desc"] },
  ];
};
