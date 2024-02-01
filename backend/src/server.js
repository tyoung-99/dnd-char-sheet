import express from "express";
import getCharacters from "./getCharacters.js";

const app = express();

app.get("/api/characters", async (req, res) => {
  const charList = await getCharacters();

  if (charList) {
    res.json(charList);
  } else {
    res.sendStatus(404);
  }
});

app.get("/api/characters/:id", async (req, res) => {
  const { id } = req.params;
  const charList = await getCharacters();
  const char = charList.find((elem) => elem.id === parseInt(id));

  if (char) {
    res.json(char);
  } else {
    res.sendStatus(404);
  }
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
