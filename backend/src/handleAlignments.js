import { readFile } from "fs/promises";

const getAlignments = async () => {
  const alignments = JSON.parse(await readFile("data/alignments.json"));
  return alignments;
};

export default getAlignments;
