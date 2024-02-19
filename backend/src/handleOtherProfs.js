import { readFile } from "fs/promises";

export const getWeaponProfs = async () => {
  const weaponProfs = JSON.parse(await readFile("data/weapon_profs.json"));
  return weaponProfs;
};

export const getArmorProfs = async () => {
  const armorProfs = JSON.parse(await readFile("data/armor_profs.json"));
  return armorProfs;
};
