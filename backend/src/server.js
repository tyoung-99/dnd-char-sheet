import { writeFile, readFile } from "fs/promises";
import express from "express";
import updateData from "./updateData.js";

const app = express();
app.use(express.json());

const sampleChars = JSON.parse(
  await readFile("./src/sample-content/CharactersContentSample.json")
);

// Character
app.get("/api/characters", async (req, res) => {
  const characters = sampleChars;

  if (characters) {
    res.json(characters);
  } else {
    res.sendStatus(404);
  }
});

app.get("/api/characters/:id", async (req, res) => {
  const { id } = req.params;
  const character = sampleChars.find(
    (character) => character.id === parseInt(id)
  );

  if (character) {
    res.json(character);
  } else {
    res.sendStatus(404);
  }
});

app.put("/api/characters/:id/update", async (req, res) => {
  const { id } = req.params;
  const { newChar } = req.body;
  const characterIndex = sampleChars.findIndex(
    (character) => character.id === parseInt(id)
  );

  if (characterIndex >= 0) {
    sampleChars[characterIndex] = newChar;
    try {
      await writeFile(
        "./src/sample-content/Output.json",
        JSON.stringify([newChar])
      );
    } catch (error) {
      console.log(error);
      res.send("Couldn't write character to example file.");
    }
    res.send("Character successfully updated.");
  } else {
    res.send("Character doesn't exist.");
  }
});

// General Data
app.get("/api/data/:type", async (req, res) => {
  const { type } = req.params;
  let data;

  switch (type) {
    case "races":
      data = JSON.parse(await readFile("./src/sample-content/races.json"));
      break;
    default:
      break;
  }

  if (data) {
    res.json(data);
  } else {
    res.sendStatus(404);
  }
});

app.put("/api/data/:type/update", async (req, res) => {
  const { type } = req.params;
  const { newData } = req.body;

  res.send(updateData(type, newData));
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
