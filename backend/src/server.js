import express from "express";
import multer from "multer";
import { getCharacters, setCharacter } from "./handleCharacters.js";
import { getImg, removeImg } from "./handleImg.js";
import { getAlignments } from "./handleAlignments.js";
import { getWeaponProfs, getArmorProfs } from "./handleOtherProfs.js";
import {
  getRaces,
  getRaceSrcbooks,
  getRaceFeatures,
  getSubraces,
  getSubraceSrcbooks,
  getSubraceFeatures,
} from "./handleRaces.js";

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
  res.send(await getAlignments());
});

// Proficiencies
app.get("/api/proficiencies/weapons", async (req, res) => {
  res.send(await getWeaponProfs());
});

app.get("/api/proficiencies/armor", async (req, res) => {
  res.send(await getArmorProfs());
});

// Races
app.get("/api/races/list", async (req, res) => {
  res.send(await getRaces());
});
app.get("/api/races/:raceName/sources", async (req, res) => {
  const { raceName } = req.params;
  res.send(await getRaceSrcbooks());
});
app.get(
  "/api/races/:raceName/sources/:raceSrcBook/features",
  async (req, res) => {
    const { raceName, raceSrcBook } = req.params;
    res.send(await getRaceFeatures());
  }
);
app.get(
  "/api/races/:raceName/sources/:raceSrcBook/subraces/list",
  async (req, res) => {
    const { raceName, raceSrcBook } = req.params;
    res.send(await getSubraces());
  }
);
app.get(
  "/api/races/:raceName/sources/:raceSrcBook/subraces/:subraceName/sources",
  async (req, res) => {
    const { raceName, raceSrcBook, subraceName } = req.params;
    res.send(await getSubraceSrcbooks());
  }
);
app.get(
  "/api/races/:raceName/sources/:raceSrcBook/subraces/:subraceName/sources/:subraceSrcBook/features",
  async (req, res) => {
    const { raceName, raceSrcBook, subraceName, subraceSrcBook } = req.params;
    res.send(await getSubraceFeatures());
  }
);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
