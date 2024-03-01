import { ObjectId } from "mongodb";

export const getFeats = async (db) => {
  const collection = db.collection("feats");
  const feats = await collection.find({}).toArray();
  return feats;
};

export const getOneFeat = async (db, featId) => {
  const feat = await db
    .collection("feats")
    .findOne({ _id: ObjectId.createFromHexString(featId) });
  return feat;
};
