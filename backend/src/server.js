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
import { getSources, getOneSource } from "./handleSources.js";
import { getAlignments } from "./handleAlignments.js";
import { getWeaponProfs, getArmorProfs } from "./handleOtherProfs.js";
import {
  getRaces,
  getOneRace,
  getOneSubrace,
  getSubracesFromParent,
  getAllRacialFeatures,
  getRacialFeaturesFromList,
  getOneRacialFeature,
  deleteRace,
  deleteSubrace,
  deleteRacialFeature,
  updateRace,
  updateSubrace,
  insertRace,
  insertSubrace,
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

// Sources
app.get("/api/sources", async (req, res) => {
  res.send(await getSources(db));
});
app.get("/api/sources/:sourceId", async (req, res) => {
  const { sourceId } = req.params;
  res.send(await getOneSource(db, sourceId));
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

// Races
app.get("/api/races", async (req, res) => {
  res.send(await getRaces(db));
});
app.get("/api/races/:raceId", async (req, res) => {
  const { raceId } = req.params;
  res.send(await getOneRace(db, raceId));
});
app.get("/api/races/:raceId/subraces", async (req, res) => {
  const { raceId } = req.params;
  res.send(await getSubracesFromParent(db, raceId));
});
app.get("/api/subraces/:subraceId", async (req, res) => {
  const { subraceId } = req.params;
  res.send(await getOneSubrace(db, subraceId));
});
app.get("/api/racialFeatures", async (req, res) => {
  res.json(await getAllRacialFeatures(db));
});
app.get("/api/racialFeatures/multiple/:featureIds", async (req, res) => {
  let { featureIds } = req.params;
  featureIds = featureIds.split(",");
  res.send(await getRacialFeaturesFromList(db, featureIds));
});
app.get("/api/racialFeatures/one/:featureId", async (req, res) => {
  const { featureId } = req.params;
  res.send(await getOneRacialFeature(db, featureId));
});
app.delete("/api/races/:raceId/delete", async (req, res) => {
  const { raceId } = req.params;
  await deleteRace(db, raceId);
  res.json(await getRaces(db));
});
// just deletes subrace
app.delete("/api/subraces/:raceId/delete/", async (req, res) => {
  const { raceId } = req.params;
  await deleteSubrace(db, raceId);
  res.send("Deleted subrace");
});
// special subrace delete that sends back updated list of subraces
app.delete("/api/subraces/:raceId/delete/:parentId", async (req, res) => {
  const { raceId, parentId } = req.params;
  await deleteSubrace(db, raceId);
  const response = await getSubracesFromParent(db, parentId);
  res.json(response);
});
app.delete("/api/racialFeatures/:id/delete", async (req, res) => {
  const { id } = req.params;
  await deleteRacialFeature(db, id);
  // const racialFeatures = await getAllRacialFeatures(db);
  res.send("Nothing"); // may change later idk
});
app.put("/api/races/:raceId/update", async (req, res) => {
  const { raceId } = req.params;
  const { name, source, features } = req.body;
  await updateRace(db, raceId, name, source, features);
});
app.put("/api/subraces/:raceId/update", async (req, res) => {
  const { raceId } = req.params;
  const { name, displayName, source, features } = req.body;
  await updateSubrace(db, raceId, name, displayName, source, features);
});
app.post("/api/races/insert", async (req, res) => {
  const { name, source, features } = req.body;
  await insertRace(db, name, source, features);
  res.json(await getRaces(db));
});
app.post("/api/subraces/insert", async (req, res) => {
  const { name, displayName, parentRace, source, features } = req.body;
  await insertSubrace(db, name, displayName, parentRace, source, features);
  res.json(await getSubracesFromParent(db, parentRace));
});

const PORT = process.env.PORT || 8000;

connectToDb(() => {
  console.log("Successfully connected to database!");
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});
