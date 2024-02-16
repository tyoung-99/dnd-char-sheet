import express from "express";
import multer from "multer";
import getCharacters from "./getCharacters.js";
import setCharacter from "./setCharacter.js";
import getImg from "./getImg.js";
import removeImg from "./removeImg.js";
import getAlignments from "./handleAlignments.js";

const app = express();
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "img/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}.${file.mimetype.split("/")[1]}`);
  },
});
const imgUpload = multer({ storage: storage });

app.get("/api/characters", async (req, res) => {
  const charList = await getCharacters();

  if (charList) {
    res.json(charList);
  } else {
    res.sendStatus(404);
  }
});

// Character specific
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

app.put("/api/characters/:id/update", async (req, res) => {
  const { id } = req.params;
  const { newChar } = req.body;
  res.send(await setCharacter(parseInt(id), newChar));
});

app.get("/api/img/char/:id", async (req, res) => {
  const { id } = req.params;
  res.send(await getImg(id));
});

app.put("/api/img/char/add", imgUpload.single("file"), async (req, res) => {
  const { file } = req;
  if (file) {
    res.send(file.filename.slice(0, file.filename.lastIndexOf(".")));
  }
});

app.post("/api/img/char/:id/remove", async (req, res) => {
  const { id } = req.params;
  res.send(await removeImg(id));
});

// Alignments
app.get("/api/alignments", async (req, res) => {
  console.log("here");
  res.send(await getAlignments());
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
