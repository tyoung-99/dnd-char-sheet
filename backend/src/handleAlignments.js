// alignments is set up to be a object with key name: alignments, content: alignments array
// It may make more sense to change this in the future
export const getAlignments = async (db) => {
  const alignments = await db.collection('alignments').findOne({ name: "alignments" });
  return alignments.content;
};
