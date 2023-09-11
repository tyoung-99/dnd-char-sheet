import express from "express";
import getCharacters from "./getCharacters.js";
import setCharacterOne from "./setCharacterOne.js";
import getData from "./getData.js";
import setData from "./setData.js";

const app = express();
app.use(express.json());

// Character
app.get("/api/characters", async (req, res) => {
  const characters = await getCharacters();

  if (characters) {
    res.json(characters);
  } else {
    res.sendStatus(404);
  }
});

app.get("/api/characters/:id", async (req, res) => {
  const { id } = req.params;
  const characters = await getCharacters();

  const character = characters.find(
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
  res.send(await setCharacterOne(parseInt(id), newChar));
});

// General data on races, backgrounds, classes, etc.
app.get("/api/data/:type", async (req, res) => {
  const { type } = req.params;
  const data = getData(type);

  data.then((result) => {
    if (result) {
      res.json(result);
    } else {
      res.sendStatus(404);
    }
  });
});

app.put("/api/data/:type/update", async (req, res) => {
  const { type } = req.params;
  const { newData } = req.body;
  res.send(await setData(newData, type));
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
