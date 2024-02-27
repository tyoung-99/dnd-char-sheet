import { ObjectId } from "mongodb";

export const getRaces = async (db) => {
  const collection = db.collection("races");
  const races = await collection.find({}).toArray();
  return races;
};

export const getSubracesFromParent = async (db, raceId) => {
  const collection = db.collection("subraces");
  const subraces = await collection.find({ parentRace: raceId }).toArray();
  return subraces;
};

export const getOneRace = async (db, raceId) => {
  const collection = db.collection("races");
  const race = await collection.findOne({
    _id: ObjectId.createFromHexString(raceId),
  });
  return race;
};

export const getOneSubrace = async (db, subraceId) => {
  const collection = db.collection("subraces");
  const subrace = await collection.findOne({
    _id: ObjectId.createFromHexString(subraceId),
  });
  return subrace;
};
