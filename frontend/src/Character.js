// Represents 1 character and all its data, performs various calculations on data to allow easier external access to elements of character that depend on other elements

class Character {
  // Order of groups reversed b/c when inserting into list of profs, order gets reversed again
  WEAPON_PROF_GROUPS = [
    {
      name: "Martial",
      profs: [
        "Battleaxes",
        "Double-bladed Scimitars",
        "Flails",
        "Glaives",
        "Greataxes",
        "Greatswords",
        "Halberds",
        "Lances",
        "Longswords",
        "Mauls",
        "Morningstars",
        "Pikes",
        "Rapiers",
        "Scimitars",
        "Shortswords",
        "Tridents",
        "War Picks",
        "Warhammers",
        "Whips",
        "Blowguns",
        "Hand Crossbows",
        "Heavy Crossbows",
        "Longbows",
        "Nets",
      ],
    },
    {
      name: "Simple",
      profs: [
        "Clubs",
        "Daggers",
        "Greatclubs",
        "Handaxes",
        "Javelins",
        "Light Hammers",
        "Maces",
        "Quarterstaffs",
        "Sickles",
        "Spears",
        "Yklwas",
        "Light Crossbows",
        "Darts",
        "Shortbows",
        "Slings",
      ],
    },
  ];
  ARMOR_PROF_GROUPS = [
    {
      name: "Heavy",
      profs: ["Ring Mail", "Chain Mail", "Splint", "Plate"],
    },
    {
      name: "Medium",
      profs: [
        "Hide",
        "Chain Shirt",
        "Scale Mail",
        "Breastplate",
        "Half Plate",
        "Spiked Armor",
      ],
    },
    { name: "Light", profs: ["Padded", "Leather", "Studded Leather"] },
  ];

  getAbilities() {
    return this.abilities.map((ability) => ({
      name: ability.name,
      score: ability.score,
      mod: this.getAbilityMod(ability.name),
    }));
  }

  getAbilityScore(ability) {
    return this.abilities.find((stat) => stat.name === ability).score;
  }

  getAbilityMod(ability) {
    return Math.floor(
      (this.abilities.find((stat) => stat.name === ability).score - 10) / 2
    );
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

  getSkills() {
    let skills = [];
    this.abilities.forEach((ability) => {
      ability.skillProfs.forEach((skill) => {
        skills.push({
          name: skill.name,
          prof: skill.proficiency,
          mod:
            this.getAbilityMod(ability.name) +
            skill.proficiency * this.getProfBonus(),
          ability: ability.name,
        });
      });
    });

    skills.sort((first, second) =>
      first.name > second.name ? 1 : first.name === second.name ? 0 : -1
    );
    return skills;
  }

  getSkillByName(skill) {
    const ability = this.abilities.find((ability) =>
      ability.skillProfs.some((checkSkill) => checkSkill.name === skill)
    );
    return (
      this.getAbilityMod(ability.name) +
      ability.skillProfs.find((checkSkill) => checkSkill.name === skill)
        .proficiency *
        this.getProfBonus()
    );
  }

  getPassivePerception() {
    return 10 + this.getSkillByName("Perception");
  }

  getSaves() {
    return this.abilities.map((ability) => ({
      name: ability.name,
      prof: ability.saveProf,
      mod:
        this.getAbilityMod(ability.name) +
        ability.saveProf * this.getProfBonus(),
    }));
  }

  getWeaponProfs() {
    let cleanProfs = [...this.weaponProfs];
    this.WEAPON_PROF_GROUPS.forEach((group) => {
      if (group.profs.every((prof) => cleanProfs.includes(prof))) {
        cleanProfs.unshift(group.name);
        cleanProfs = cleanProfs.filter((prof) => !group.profs.includes(prof));
      }
    });
    return cleanProfs;
  }

  getArmorProfs() {
    let cleanProfs = [...this.armorProfs];
    this.ARMOR_PROF_GROUPS.forEach((group) => {
      if (group.profs.every((prof) => cleanProfs.includes(prof))) {
        cleanProfs.unshift(group.name);
        cleanProfs = cleanProfs.filter((prof) => !group.profs.includes(prof));
      }
    });
    return cleanProfs;
  }

  isProficientWithItem(item) {
    return item.profRequired.some(
      (prof) =>
        this.weaponProfs.includes(prof) ||
        this.armorProfs.includes(prof) ||
        this.toolProfs.includes(prof)
    );
  }

  getInitiative() {
    return this.getAbilityMod("DEX");
  }

  getArmorClass() {
    // Compare every currently legal AC calculation, select highest
    let replacements = [],
      bonuses = [];
    let category = "ArmorClass";
    const options = this.#getFeatureEffects(category)
      .concat(this.#getBuffEffects(category))
      .concat(this.#getItemEffects(category));

    options.forEach((option) => {
      const effect = option.effects.find(
        (checkEffect) => checkEffect.category === category
      );

      if (effect.changes.replace) {
        replacements.push(effect.changes);
      } else if (effect.changes.bonus) {
        bonuses.push(effect.changes);
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

  getMaxHitPoints() {
    return this.#getHitPointsHelper(this.hitPoints.max, "MaxHitPoints");
  }

  getCurrentHitPoints() {
    return this.#getHitPointsHelper(this.hitPoints.current, "CurrentHitPoints");
  }

  #getHitPointsHelper(category, categoryName) {
    const bonuses = this.#getFeatureEffects(categoryName)
      .concat(this.#getBuffEffects(categoryName))
      .concat(this.#getItemEffects(categoryName));

    return (
      category.base +
      bonuses.reduce(
        (total, elem) =>
          total +
          elem.effects.reduce(
            (subtotal, effect) =>
              effect.category === categoryName
                ? subtotal + effect.changes.bonus
                : subtotal,
            0
          ),
        0
      )
    );
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

  getAttack(item) {
    return [this.#getAttackMod(item), this.#getAttackDamage(item)];
  }

  #getAttackMod(item) {
    const strMod = this.getAbilityMod("STR");
    const dexMod = this.getAbilityMod("DEX");
    const abilityMod =
      item.subtypes.includes("Ranged") ||
      (item.properties.includes("Finesse") && dexMod > strMod)
        ? dexMod
        : strMod;
    const profMod = this.isProficientWithItem(item) ? this.getProfBonus() : 0;

    const attackMod = {
      flat: abilityMod + profMod + (item.attackBonus || 0),
      dice: [],
    };

    let category = "AttackMod";
    const attackBonuses = this.#getFeatureEffects(category)
      .concat(this.#getBuffEffects(category))
      .concat(this.#getItemEffects(category));

    let flatAttackBonus = 0;
    let attackDice = [];
    attackBonuses.forEach((bonus) => {
      bonus.effects.forEach((effect) => {
        if (effect.category === category) {
          flatAttackBonus += effect.changes.flat || 0;

          if (effect.changes.dice) {
            this.#addDiceToArr(attackDice, [effect.changes.dice]);
          }
        }
      });
    });
    attackMod.flat += flatAttackBonus;
    attackMod.dice = attackDice.sort(
      (first, second) => second.sides - first.sides
    );

    return attackMod;
  }

  #getAttackDamage(item) {
    const strMod = this.getAbilityMod("STR");
    const dexMod = this.getAbilityMod("DEX");
    const abilityMod =
      item.subtypes.includes("Ranged") ||
      (item.properties.includes("Finesse") && dexMod > strMod)
        ? dexMod
        : strMod;

    let damage = JSON.parse(JSON.stringify(item.damage.base));
    damage[0].flat = abilityMod + (damage[0].flat || 0);
    if (item.activated) {
      damage = damage.concat(item.damage.activated);
    }

    const category = "DamageMod";
    const damageBonuses = this.#getFeatureEffects(category)
      .concat(this.#getBuffEffects(category))
      .concat(this.#getItemEffects(category));

    damageBonuses.forEach((bonus) => {
      bonus.effects.forEach((effect) => {
        if (effect.category === category) {
          let index = damage.findIndex(
            (checkDamage) => checkDamage.type === effect.changes.type
          );
          if (index < 0) {
            damage.push({
              dice: [],
              flat: 0,
              type: effect.changes.type,
            });
            index = damage.length - 1;
          }

          damage[index].flat =
            (effect.changes.flat || 0) + (damage[index].flat || 0);

          if (effect.changes.dice) {
            this.#addDiceToArr(damage[index].dice, effect.changes.dice);
          }
        }
      });
    });

    return damage;
  }

  #addDiceToArr(diceArr, newDice) {
    newDice.forEach((die) => {
      const index = diceArr.findIndex(
        (checkDie) => checkDie.sides === die.sides
      );
      if (index < 0) {
        diceArr.push({ number: die.number, sides: die.sides });
      } else {
        diceArr[index].number += die.number;
      }
    });
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

  getEquippedItems() {
    return this.equipment.filter((item) => item.equipped);
  }

  getItemsByType(type) {
    return this.equipment.filter((item) => item.type === type);
  }

  getItem(itemName) {
    return this.equipment.find((item) => item.name === itemName);
  }

  #getItemEffects(category) {
    return this.equipment.filter(
      (item) =>
        item.effects &&
        item.effects.some(
          (effect) => effect.category === category && item.equipped
        )
    );
  }

  getTreasure() {
    return this.equipment.filter((item) => item.type === "Treasure");
  }

  getFeature(featureName) {
    return this.features.find((feature) => feature.name === featureName);
  }

  getClassFeatures() {
    return this.features.filter((feature) => feature.class);
  }

  getOtherFeatures() {
    return this.features.filter((feature) => !feature.class);
  }

  #getFeatureEffects(category) {
    return this.features.filter(
      (feature) =>
        feature.effects &&
        feature.effects.some((effect) => effect.category === category)
    );
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

  getBuff(buffName) {
    return this.buffs.find((buff) => buff.name === buffName);
  }

  #getBuffEffects(category) {
    return this.buffs.filter(
      (buff) =>
        buff.effects &&
        buff.effects.some((effect) => effect.category === category)
    );
  }
}

export default Character;
