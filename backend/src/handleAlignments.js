import { readFile } from "fs/promises";

export const getAlignments = async () => {
  const alignments = JSON.parse(await readFile("data/alignments.json"));
  return alignments;
};
