import { ObjectId } from "mongodb";

export const getRaces = async (db) => {
  // specifically for the mongodb find method, you must seperate the collection and find method on two lines
  const collection = db.collection("races");
  const races = await collection.find({}).toArray();
  return races;
};

export const getAllRacialFeatures = async (db) => {
  const collection = db.collection("racialFeatures");
  const raceFeatures = await collection.find({}).toArray();
  return raceFeatures;
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

export const getOneRacialFeature = async (db, featureId) => {
  const collection = db.collection("racialFeatures");
  const feature = await collection.findOne({
    _id: ObjectId.createFromHexString(featureId),
  });
  return feature;
};

export const getRacialFeaturesFromList = async (db, featureIdList) => {
  const collection = db.collection("racialFeatures");
  featureIdList = featureIdList.map((id) => ObjectId.createFromHexString(id));
  const features = await collection
    .find({
      _id: { $in: featureIdList },
    })
    .toArray();
  return features;
};

export const deleteRace = async (db, id) => {
  await db
    .collection("races")
    .deleteOne({ _id: ObjectId.createFromHexString(id) });
};

export const deleteSubrace = async (db, id) => {
  await db.collection("subraces").deleteOne({
    _id: ObjectId.createFromHexString(id),
  });
};

export const deleteRacialFeature = async (db, id) => {
  await db.collection("racialFeatures").deleteOne({
    _id: ObjectId.createFromHexString(id),
  });
};

export const updateRace = async (db, id, name, source, features) => {
  await db.collection("races").updateOne(
    { _id: ObjectId.createFromHexString(id) },
    {
      $set: { name: name, source: source, features: features },
    }
  );
};

export const updateSubrace = async (
  db,
  id,
  name,
  displayName,
  source,
  features
) => {
  await db.collection("subraces").updateOne(
    { _id: ObjectId.createFromHexString(id) },
    {
      $set: {
        name: name,
        displayName: displayName,
        source: source,
        features: features,
      },
    }
  );
};

export const insertRace = async (db, name, source, features) => {
  await db.collection("races").insertOne({
    name: name,
    source: source,
    features: features,
  });
};

export const insertSubrace = async (
  db,
  name,
  displayName,
  parentRace,
  source,
  features
) => {
  await db.collection("subraces").insertOne({
    name: name,
    displayName: displayName,
    parentRace: parentRace,
    source: source,
    features: features,
  });
};
