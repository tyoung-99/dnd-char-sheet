import express from "express";
import sampleChars from "./CharactersContentSample.js";

const app = express();

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

app.get("/api/images/:file-name", async (req, res) => {
  console.log("here");
  const { fileName } = req.params;
  console.log(fileName);
  const image = await readFile(`../imgs/${fileName}`);
  if (image) {
    res.sendFile(image);
  } else {
    res.sendStatus(404);
  }
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
