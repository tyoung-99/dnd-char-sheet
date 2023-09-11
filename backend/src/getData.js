import { readFile } from "fs/promises";

const getData = async (type) => {
  let data;
  switch (type) {
    case "races":
      data = JSON.parse(await readFile("./src/sample-content/races.json"));
      break;
    default:
      break;
  }

  return data;
};

export default getData;
