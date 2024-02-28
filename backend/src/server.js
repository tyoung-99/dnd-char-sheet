import express from "express";
import multer from "multer";
import "dotenv/config";
import { db, connectToDb } from "./db.js";
import { MongoClient, ObjectId } from "mongodb";
import {
  getCharacters,
  getOneCharacter,
  setCharacter,
} from "./handleCharacters.js";
import { getImg, removeImg } from "./handleImg.js";
import { getAlignments } from "./handleAlignments.js";
import { getWeaponProfs, getArmorProfs } from "./handleOtherProfs.js";
import {
  getRaces,
  getSubracesFromParent,
  getAllRacialFeatures,
  deleteRace,
  deleteSubrace,
  deleteRacialFeature,
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

// Races, subraces
app.get("/api/races", async (req, res) => {
  const racesList = await getRaces(db);

  if (racesList) {
    res.json(racesList);
  } else {
    res.sendStatus(404);
  }
});

app.get("/api/subraces/:raceId", async (req, res) => {
  const { raceId } = req.params;
  const subracesList = await getSubracesFromParent(db, raceId);

  if (subracesList) {
    res.json(subracesList);
  } else {
    res.sendStatus(404);
  }
});

app.get("/api/racialFeatures", async (req, res) => {
  const racialFeatures = await getAllRacialFeatures(db);

  if (racialFeatures) {
    res.json(racialFeatures);
  } else {
    res.sendStatus(404);
  }
});

app.delete("/api/races/:id/delete", async (req, res) => {
  const { id } = req.params;

  deleteRace(db, id);
  const racesList = await getRaces(db);
  res.json(racesList);
});

app.delete("/api/subraces/:id/delete", async (req, res) => {
  const { id } = req.params;

  deleteSubrace(db, id);
  const racesList = await getSubracesFromParent(db);
  res.json(racesList);
});

app.delete("/api/racialFeatures/:id/delete", async (req, res) => {
  const { id } = req.params;

  deleteRacialFeature(db, id);
  // const racialFeatures = await getAllRacialFeatures(db);
  res.send("Nothing"); // may change later idk
});

app.get("/api/characters", async (req, res) => {
  const charList = await getCharacters(db);

  if (charList) {
    res.json(charList);
  } else {
    res.sendStatus(404);
  }
});

// Character specific
app.get("/api/characters/:id", async (req, res) => {
  const { id } = req.params;

  // If we want to use the MongoDB id: Getting object _id from mongodb format:
  // var o_id = ObjectId.createFromHexString('65d3d20f6bce77f479d8babc');

  const char = await getOneCharacter(db, parseInt(id));

  if (char) {
    res.json(char);
  } else {
    res.sendStatus(404);
  }
});

app.put("/api/characters/:id/update", async (req, res) => {
  const { id } = req.params;
  const { newChar } = req.body;
  res.send(await setCharacter(db, parseInt(id), newChar));
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
  res.send(await getAlignments(db));
});

// Proficiencies
app.get("/api/proficiencies/weapons", async (req, res) => {
  res.send(await getWeaponProfs(db));
});

app.get("/api/proficiencies/armor", async (req, res) => {
  res.send(await getArmorProfs(db));
});

const PORT = process.env.PORT || 8000;

connectToDb(() => {
  console.log("Successfully connected to database!");
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});
