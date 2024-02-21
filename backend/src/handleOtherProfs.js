export const getWeaponProfs = async (db) => {
  const collection = db.collection('proficiencies');
  const weaponProfs = await collection.find({ "profType": "Weapon" }).toArray();
  return weaponProfs;
};

export const getArmorProfs = async (db) => {
  const collection = db.collection('proficiencies');
  const armorProfs = await collection.find({ "profType": "Armor" }).toArray();
  return armorProfs;
};
