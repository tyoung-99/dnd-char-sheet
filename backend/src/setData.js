import { writeFile } from "fs/promises";
import getData from "./getData.js";

const setData = async (newData, dataType, updateType) => {
  const existing = await getData(dataType);
  console.log("pre");
  console.log(existing);
  switch (updateType) {
    case "update":
      const replaceIndex = existing.findIndex(
        (element) => element.id === newData.id
      );
      existing[replaceIndex] = newData;
      break;

    case "add":
      let nextID = 0;
      existing.forEach((element) => {
        if (element.id >= nextID) {
          nextID = element.id + 1;
        }
      });
      newData.id = nextID;
      existing.push(newData);
      break;

    case "remove":
      const removeIndex = existing.findIndex(
        (element) => element.id === newData.id
      );
      existing.splice(removeIndex, 1);
      break;

    default:
      return `Unknown update type: ${updateType}`;
  }
  console.log("post");
  console.log(existing);

  try {
    await writeFile(
      `./src/sample-content/${dataType}.json`,
      JSON.stringify(existing)
    );
  } catch (error) {
    return `Failed to write to ${dataType}.json.`;
  }

  switch (updateType) {
    case "update":
    case "remove":
      return existing;

    case "add":
      return newData;
  }
};

export default setData;
