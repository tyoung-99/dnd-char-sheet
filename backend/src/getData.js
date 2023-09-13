import { readFile } from "fs/promises";

const getData = async (type) => {
  try {
    const data = JSON.parse(
      await readFile(`./src/sample-content/${type}.json`)
    );
    return data;
  } catch (error) {
    return `Failed to read from ${type}.json.`;
  }
};

export default getData;
