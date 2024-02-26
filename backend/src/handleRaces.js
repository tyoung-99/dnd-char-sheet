import { ObjectId } from "mongodb";

export const getRaces = async (db) => {
  const collection = db.collection("races");
  const races = await collection.find({}).toArray();
  console.log(races);
  return races;
};

export const getOneRace = async (db, raceId) => {
  return getOneHelper(db, "races", raceId);
};

export const getSubraces = async (db, raceId) => {
  const collection = db.collection("subraces");
  const subraces = await collection.find({ parentRace: raceId }).toArray();
  console.log(subraces);
  return subraces;
};

export const getOneSubrace = async (db, subraceId) => {
  return getOneHelper(db, "subraces", subraceId);
};

const getOneHelper = async (db, collectionName, id) => {
  const mainCollection = db.collection(collectionName);
  const featureCollection = db.collection("racialFeatures");

  const race = await mainCollection.findOne({
    _id: ObjectId.createFromHexString(id),
  });

  for (let i = 0; i < race.features.length; i++) {
    race.features[i] = await featureCollection.findOne({
      _id: ObjectId.createFromHexString(race.features[i]),
    });
  }

  console.log(race);

  return race;
};
