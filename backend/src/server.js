import { readFile } from "fs/promises";
import express from "express";
import sampleChars from "./sample-content/CharactersContentSample.js";

const app = express();
app.use(express.json());

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
    res.send("Character successfully updated.");
  } else {
    res.send("Character doesn't exist.");
  }
});

// General Data
app.get("/api/data/races", async (req, res) => {
  const data = JSON.parse(await readFile("./src/sample-content/races.json"));

  if (data) {
    res.json(data);
  } else {
    res.sendStatus(404);
  }
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
