import { ObjectId } from "mongodb";

export const getOneSource = async (db) => {
  const sources = await db
    .collection("sources")
    .findOne({ _id: ObjectId.createFromHexString(id) });
  return sources.content;
};
