import { ObjectId } from "mongodb";

export const getSources = async (db) => {
  const collection = db.collection("sources");
  const sources = await collection.find({}).toArray();
  return sources;
};

export const getOneSource = async (db, sourceId) => {
  const source = await db
    .collection("sources")
    .findOne({ _id: ObjectId.createFromHexString(sourceId) });
  return source;
};
