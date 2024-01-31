// Represents 1 character and all its data

class Character {
  isProficientWithItem(item) {
    return item.profRequired.some(
      (prof) =>
        this.weaponProfs.includes(prof) ||
        this.armorProfs.includes(prof) ||
        this.toolProfs.includes(prof)
    );
  }

  getAttack(item) {
    const strMod = this.getAbilityMod("STR");
    const dexMod = this.getAbilityMod("DEX");

    const abilityMod =
      item.subtypes.includes("Ranged") ||
      (item.properties.includes("Finesse") && dexMod > strMod)
        ? dexMod
        : strMod;
    const profMod = this.isProficientWithItem(item) ? this.getProfBonus() : 0;

    const attackMod = abilityMod + profMod + (item.attackBonus || 0);

    const damage = JSON.parse(JSON.stringify(item.damage.base));
    damage[0].mod = abilityMod + (damage[0].mod || 0);
    if (item.activated) {
      damage.concat(item.damage.activated);
    }

    return [attackMod, damage];
  }

  getProfBonus() {
    return (
      Math.ceil(
        this.classes.reduce(
          (totalLevel, charClass) => totalLevel + charClass.classLevel,
          0
        ) / 4
      ) + 1
    );
  }

  getAbilityScore(ability) {
    return this.stats.find((stat) => stat.name === ability).score;
  }

  getAbilityMod(ability) {
    return Math.floor(
      (this.stats.find((stat) => stat.name === ability).score - 10) / 2
    );
  }

  getInitiative() {
    return this.getAbilityMod("DEX");
  }

  getFeature(featureName) {
    return this.abilities.find((ability) => ability.name === featureName);
  }

  getItem(itemName) {
    return this.equipment.find((item) => item.name === itemName);
  }

  getItemsByType(type) {
    return this.equipment.filter((item) => item.type === type);
  }

  getItems() {
    const items = {};
    this.equipment.forEach((item) => {
      if (item.type !== "Treasure") {
        if (!(item.type in items)) {
          items[item.type] = [];
        }
        items[item.type].push(item);
      }
    });
    return items;
  }

  getTreasure() {
    return this.equipment.filter((item) => item.type === "Treasure");
  }

  getEquippedItems() {
    return this.equipment.filter((item) => item.equipped);
  }

  getArmorClass() {
    // Compare every currently legal AC calculation, select highest
    let replacements = [],
      bonuses = [];

    this.armorClass.forEach((option) => {
      if (option.class) {
        option = this.getFeature(option.name).effects.find(
          (effect) => effect.category === "armorClass"
        ).changes;
      } else if (option.item) {
        option = this.getItem(option.item).effects.find(
          (effect) => effect.category === "armorClass"
        ).changes;
      }

      if (option.replace) {
        replacements.push(option);
      } else if (option.bonus) {
        bonuses.push(option);
      }
    });

    replacements = this.#validateArmorClassReplacements(replacements);
    bonuses = this.#validateArmorClassBonuses(bonuses);

    if (!this.getEquippedItems().some((item) => item.type === "Armor")) {
      replacements.push(10 + this.getAbilityMod("DEX"));
    }

    return (
      Math.max(...replacements) +
      bonuses.reduce((total, bonus) => total + bonus, 0)
    );
  }

  #validateArmorClassReplacements(replacements) {
    const equippedItems = this.getEquippedItems();
    replacements = replacements.map((option) => {
      if (
        option.noArmor &&
        equippedItems.some(
          (item) => item.type === "Armor" && !item.subtypes.includes["Shield"]
        )
      ) {
        return -1;
      }

      if (
        option.noShield &&
        equippedItems.some(
          (item) => item.type === "Armor" && item.subtypes.includes["Shield"]
        )
      ) {
        return -1;
      }

      const mods = option.replace.mods.map((mod, i) => {
        let val = this.getAbilityMod(mod);
        if (option.replace.modCaps && val > option.replace.modCaps[i]) {
          val = option.replace.modCaps[i];
        }
        return val;
      });

      return option.replace.base + mods.reduce((total, mod) => total + mod);
    });
    return replacements;
  }

  #validateArmorClassBonuses(bonuses) {
    const equippedItems = this.getEquippedItems();
    bonuses = bonuses.map((option) => {
      if (
        option.noArmor &&
        equippedItems.some(
          (item) => item.type === "Armor" && !item.subtypes.includes["Shield"]
        )
      ) {
        return 0;
      }

      if (
        option.noShield &&
        equippedItems.some(
          (item) => item.type === "Armor" && item.subtypes.includes["Shield"]
        )
      ) {
        return 0;
      }

      let mods = option.bonus.mods.map((mod, i) => {
        let val = this.getAbilityMod(mod);
        if (val > option.replace.modCaps[i]) {
          val = option.replace.modCaps[i];
        }
        return val;
      });
      mods.push(option.bonus.flat);
      mods = mods.reduce((total, mod) => total + mod);

      return mods;
    });
    return bonuses;
  }

  getCurrentHitDice() {
    const total = this.getTotalHitDice();
    const current = this.usedHitDice.map((usedDie) => ({
      number:
        total.find((totalDie) => totalDie.sides === usedDie.sides).number -
        usedDie.number,
      sides: usedDie.sides,
    }));
    return current;
  }

  getTotalHitDice() {
    let total = [];
    this.classes.forEach((charClass) => {
      let index = total.findIndex((die) => die.sides === charClass.hitDie);
      if (index === -1) {
        total.push({
          number: charClass.classLevel,
          sides: charClass.hitDie,
        });
      } else {
        total[index].number += charClass.classLevel;
      }
    });
    return total;
  }

  getClassFeatures() {
    const list = [];
    this.abilities.forEach((ability) => {
      if (ability.class) {
        list.push(ability);
      }
    });
    return list;
  }

  getOtherFeatures() {
    const list = [];
    this.abilities.forEach((ability) => {
      if (!ability.class) {
        list.push(ability);
      }
    });
    return list;
  }

  getTotalSpellSlots() {
    return this.spellcasting.spellSlots.slotsTotal.map((count, i) =>
      i < 5 ? count + this.spellcasting.pactSlots.slotsTotal[i] : count
    );
  }

  getExpendedSpellSlots() {
    return this.spellcasting.spellSlots.slotsExpended.map((count, i) =>
      i < 5 ? count + this.spellcasting.pactSlots.slotsExpended[i] : count
    );
  }

  getSpellsKnown() {
    const spellsKnown = [...Array(10)].map(() => []);
    this.spellcasting.spellsKnown.forEach((spell) => {
      spellsKnown[spell.level].push(spell);
    });

    spellsKnown.forEach((level) => {
      level.sort((first, second) =>
        first.name > second.name ? 1 : first.name === second.name ? 0 : -1
      );
      level.forEach((spell, i) => {
        spell.hoverIcons = this.#getSpellHoverIcons(spell);
      });
    });

    return spellsKnown;
  }

  #getSpellHoverIcons(spell) {
    const hoverIcons = [];

    if (spell.components.v) {
      hoverIcons.push(["verbal.png", "Verbal Component"]);
    }
    if (spell.components.s) {
      hoverIcons.push(["somatic.png", "Somatic Component"]);
    }
    if (spell.components.m) {
      hoverIcons.push(["material.png", "Material Component"]);
      if (spell.components.m.some((comp) => comp.value)) {
        hoverIcons.push(["gold_cost.png", "Material Component with Gold Cost"]);
      }
      if (spell.components.m.some((comp) => comp.consumed)) {
        hoverIcons.push(["consumed.png", "Material Component Consumed"]);
      }
    }
    if (spell.concentration) {
      hoverIcons.push(["concentration.png", "Concentration"]);
    }
    if (spell.ritual) {
      hoverIcons.push(["ritual.png", "Ritual"]);
    }
    if (spell.background) {
      hoverIcons.push(["background.png", `Background: ${spell.background}`]);
    }
    if (spell.race) {
      hoverIcons.push(["race.png", `Race: ${spell.race}`]);
    }
    if (spell.feat) {
      hoverIcons.push(["feat.png", `Feat: ${spell.feat}`]);
    }
    if (spell.class) {
      hoverIcons.push([
        `${spell.class.toLowerCase()}.png`,
        `Class: ${spell.class}`,
      ]);
    }

    return hoverIcons;
  }
}

export default Character;
