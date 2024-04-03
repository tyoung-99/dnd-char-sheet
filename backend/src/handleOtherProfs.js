export const getWeaponProfs = async (db) => {
  const collection = db.collection("proficiencies");
  const weaponProfs = await collection.find({ profType: "Weapon" }).toArray();
  return weaponProfs;
};

export const getArmorProfs = async (db) => {
  const collection = db.collection("proficiencies");
  const armorProfs = await collection.find({ profType: "Armor" }).toArray();
  return armorProfs;
};

export const getToolProfsAll = async (db) => {
  const collection = db.collection("proficiencies");
  const armorProfs = await collection.find({ profType: "Tool" }).toArray();
  return armorProfs;
};

export const getToolProfsByType = async (db, type) => {
  const collection = db.collection("proficiencies");
  const armorProfs = await collection
    .find({ profType: "Tool", name: type })
    .toArray();
  return armorProfs;
};
