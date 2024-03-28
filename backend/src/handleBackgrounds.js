import { ObjectId } from "mongodb";

export const getBackgrounds = async (db) => {
  const collection = db.collection("backgrounds");
  const backgrounds = await collection.find({}).toArray();
  return backgrounds;
};

export const getOneBackground = async (db, backgroundId) => {
  const background = await db
    .collection("backgrounds")
    .findOne({ _id: ObjectId.createFromHexString(backgroundId) });
  return background;
};

export const getBackgroundFeaturesFromList = async (db, featureIdList) => {
  const collection = db.collection("backgroundFeatures");
  featureIdList = featureIdList.map((id) => ObjectId.createFromHexString(id));
  const features = await collection
    .find({
      _id: { $in: featureIdList },
    })
    .toArray();
  return features;
};

export const getOneBackgroundFeature = async (db, featureId) => {
  const collection = db.collection("backgroundFeatures");
  const feature = await collection.findOne({
    _id: ObjectId.createFromHexString(featureId),
  });
  return feature;
};
