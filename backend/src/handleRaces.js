export const getRaces = async (db) => {
  // specifically for the mongodb find method, you must seperate the collection and find method on two lines
  const collection = db.collection("races");
  const races = await collection.find({}).toArray();
  return races;
};
