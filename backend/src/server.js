import express from "express";
import sampleChars from "./CharactersContentSample.js";

const app = express();
app.use(express.json());

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

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
