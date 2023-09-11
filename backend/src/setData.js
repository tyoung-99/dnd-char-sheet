import { writeFile } from "fs/promises";

const setData = async (newData, type) => {
  try {
    await writeFile(
      `./src/sample-content/${type}.json`,
      JSON.stringify(newData)
    );
  } catch (error) {
    return `Failed to write to ${type}.json.`;
  }

  return `${type} successfully updated.`;
};

export default setData;
