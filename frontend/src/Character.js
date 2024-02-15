// Represents 1 character and all its data, performs various calculations on data to allow easier external access to elements of character that depend on other elements

import axios from "axios";
import Timer from "./Timer";

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

  constructor(setShowingSavedMessage) {
    this.queueSave = Timer(this.saveCharacter, 5000);
    this.setShowingSavedMessage = setShowingSavedMessage;
  }

  async saveCharacter() {
    const response = await axios.put(`/api/characters/${this.id}/update`, {
      newChar: this,
    });
    if (response.data.success) this.setShowingSavedMessage(true);
    else window.alert(response.data.reason);
  }

  setName(newName) {
    this.name = newName;
    this.saveCharacter();
  }

  setAvatar(newFileId) {
    this.avatarId = newFileId;
    this.saveCharacter();
  }

  getAbilities() {
    return this.abilities.map((ability) => ({
      name: ability.name,
      score: this.getAbilityScore(ability.name),
      mod: this.getAbilityMod(ability.name),
    }));
  }

  getAbilityScore(ability) {
    const category = "AbilityScore";
    const bonuses = this.#getEffects(category);

    return (
      this.abilities.find((stat) => stat.name === ability).score +
      bonuses.reduce(
        (total, elem) =>
          total +
          elem.effects.reduce(
            (subtotal, effect) =>
              effect.category === category
                ? subtotal + effect.changes[ability] || 0
                : subtotal,
            0
          ),
        0
      )
    );
  }

  getAbilityMod(ability) {
    return Math.floor((this.getAbilityScore(ability) - 10) / 2);
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
        const newSkill = {
          name: skill.name,
          prof: 0,
          mod: this.getAbilityMod(ability.name),
          ability: ability.name,
        };

        if (skill.expSrc && !skill.profSrc) {
          newSkill.error = `Ineligible for expertise in ${skill.name}`;
        } else {
          newSkill.prof = skill.proficiency;
          newSkill.mod += skill.proficiency * this.getProfBonus();
        }

        skills.push(newSkill);
      });
    });

    const category = "Skill";
    this.#getEffects(category).forEach((bonus) => {
      const effect = bonus.effects.find(
        (checkEffect) => checkEffect.category === category
      );

      Object.keys(effect.changes.flat).forEach((skillName) => {
        skills.find((checkSkill) => checkSkill.name === skillName).mod +=
          effect.changes.flat[skillName];
      });

      effect.changes.proficiency.forEach((skillName) => {
        const skill = skills.find(
          (checkSkill) => checkSkill.name === skillName
        );
        skill.prof += 1;
        skill.mod += this.getProfBonus();
      });

      effect.changes.expertise.forEach((skillName) => {
        const skill = skills.find(
          (checkSkill) => checkSkill.name === skillName
        );
        if (skill.prof !== 1) {
          skill.error = `Ineligible for expertise in ${skill.name}`;
          return;
        }
        skill.prof += 1;
        skill.mod += this.getProfBonus();
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
    const category = "PassivePerception";
    return (
      10 +
      this.getSkillByName("Perception") +
      this.#getEffects(category).reduce(
        (total, elem) =>
          total +
          elem.effects.reduce(
            (subtotal, effect) =>
              effect.category === category
                ? subtotal + effect.changes.bonus
                : subtotal,
            0
          ),
        0
      )
    );
  }

  getSaves() {
    const saves = this.abilities.map((ability) => ({
      name: ability.name,
      prof: false,
      mod: this.getAbilityMod(ability.name),
    }));

    const saveProfs = this.#getSaveProfBonuses();
    saveProfs.forEach((saveName) => {
      const current = saves.find((checkSave) => checkSave.name === saveName);
      current.prof = true;
      current.mod += this.getProfBonus();
    });

    const bonuses = this.#getSaveOtherBonuses();
    Object.keys(bonuses).forEach((ability) => {
      saves.find((checkSave) => checkSave.name === ability).mod +=
        bonuses[ability];
    });

    return saves;
  }

  #getSaveProfBonuses() {
    const baseClass = this.classes.find(
      (checkClass) => checkClass.startingClass
    ).className;
    const saveProfs = [];

    if (["Barbarian", "Fighter", "Monk", "Ranger"].includes(baseClass)) {
      saveProfs.push("STR");
    }
    if (["Bard", "Monk", "Ranger", "Rogue"].includes(baseClass)) {
      saveProfs.push("DEX");
    }
    if (["Artificer", "Barbarian", "Fighter", "Sorcerer"].includes(baseClass)) {
      saveProfs.push("CON");
    }
    if (["Artificer", "Druid", "Rogue", "Wizard"].includes(baseClass)) {
      saveProfs.push("INT");
    }
    if (
      ["Cleric", "Druid", "Paladin", "Warlock", "Wizard"].includes(baseClass)
    ) {
      saveProfs.push("WIS");
    }
    if (
      ["Bard", "Cleric", "Paladin", "Sorcerer", "Warlock"].includes(baseClass)
    ) {
      saveProfs.push("CHA");
    }

    const category = "SavingThrow";
    this.#getEffects(category).forEach((bonus) => {
      const effect = bonus.effects.find(
        (checkEffect) => checkEffect.category === category
      );
      if (effect.changes.prof) {
        effect.changes.prof.forEach((ability) => {
          if (!saveProfs.includes(ability)) saveProfs.push(ability);
        });
      }
    });

    return saveProfs;
  }

  #getSaveOtherBonuses() {
    const category = "SavingThrow";
    const bonuses = this.#getEffects(category);
    const bonusesParsed = {
      STR: 0,
      DEX: 0,
      CON: 0,
      INT: 0,
      WIS: 0,
      CHA: 0,
    };

    bonuses.forEach((bonus) => {
      const effect = bonus.effects.find(
        (checkEffect) => checkEffect.category === category
      );
      if (effect.changes.flat) {
        Object.keys(effect.changes.flat).forEach((ability) => {
          bonusesParsed[ability] += effect.changes.flat[ability];
        });
      }
    });

    return bonusesParsed;
  }

  getWeaponProfs() {
    let cleanProfs = [
      ...new Set([...this.weaponProfs].map((prof) => prof.name)),
    ];
    this.WEAPON_PROF_GROUPS.forEach((group) => {
      if (group.profs.every((prof) => cleanProfs.includes(prof))) {
        cleanProfs.unshift(group.name);
        cleanProfs = cleanProfs.filter((prof) => !group.profs.includes(prof));
      }
    });
    return cleanProfs;
  }

  getArmorProfs() {
    let cleanProfs = [
      ...new Set([...this.armorProfs].map((prof) => prof.name)),
    ];
    this.ARMOR_PROF_GROUPS.forEach((group) => {
      if (group.profs.every((prof) => cleanProfs.includes(prof))) {
        cleanProfs.unshift(group.name);
        cleanProfs = cleanProfs.filter((prof) => !group.profs.includes(prof));
      }
    });
    return cleanProfs;
  }

  getToolProfs() {
    return [...new Set([...this.toolProfs].map((prof) => prof.name))];
  }

  getLanguages() {
    return [...new Set([...this.languages].map((prof) => prof.name))];
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
    const category = "ArmorClass";
    const options = this.#getEffects(category);

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

  getSpeeds() {
    const speeds = Object.assign({}, this.speed);
    const category = "Speed";
    const bonuses = this.#getEffects(category);
    const modifiers = { walk: 0, swim: 0, fly: 0 },
      multipliers = { walk: 1, swim: 1, fly: 1 };

    bonuses.forEach((bonus) => {
      const effect = bonus.effects.find(
        (checkEffect) => checkEffect.category === category
      );
      Object.keys(effect.changes).forEach((speedType) => {
        modifiers[speedType] += effect.changes[speedType].modifier || 0;
        multipliers[speedType] *= effect.changes[speedType].multiplier || 1;
      });
    });

    /* RAW doesn't address order of operations, using modifiers before multipliers 
    b/c it's consistent w/ how damage resistance is handled, and it makes modifiers 
    consistent in effect, rather than being devestating or negligible, as they would 
    when applied after a halving/doubling of speed, respectively */
    Object.keys(modifiers).forEach((speedType) => {
      speeds[speedType] += modifiers[speedType];
      speeds[speedType] *= multipliers[speedType];
    });

    return speeds;
  }

  getMaxHitPoints() {
    return (
      this.#getHitPointsHelper(this.hitPoints.max, "MaxHitPoints") +
      this.getAbilityMod("CON") *
        this.classes.reduce(
          (total, charClass) => total + charClass.classLevel,
          0
        )
    );
  }

  getCurrentHitPoints() {
    return this.#getHitPointsHelper(this.hitPoints.current, "CurrentHitPoints");
  }

  #getHitPointsHelper(category, categoryName) {
    const bonuses = this.#getEffects(categoryName);

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

    const category = "AttackMod";
    const attackBonuses = this.#getEffects(category);

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
    const damageBonuses = this.#getEffects(category);

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
    return this.equipment.filter((item) => {
      return (
        item.effects &&
        item.effects.some(
          (effect) => effect.category === category && item.equipped
        )
      );
    });
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

  getSpellcastingAbility(source) {
    return this.spellcasting.sources.find(
      (src) => (src.class || src.other) === source
    ).ability;
  }

  getSpellSaveDC(source) {
    return (
      8 +
      this.getProfBonus() +
      this.getAbilityMod(this.getSpellcastingAbility(source)) +
      this.#spellBonusHelper(source, "SpellSaveDC")
    );
  }

  getSpellAttackBonus(source) {
    return (
      this.getProfBonus() +
      this.getAbilityMod(this.getSpellcastingAbility(source)) +
      this.#spellBonusHelper(source, "SpellAttackBonus")
    );
  }

  #spellBonusHelper(source, category) {
    return this.#getEffects(category).reduce(
      (total, elem) =>
        total +
        elem.effects.reduce(
          (subtotal, effect) =>
            effect.category === category && effect.classRestriction === source
              ? subtotal + effect.changes.bonus
              : subtotal,
          0
        ),
      0
    );
  }

  getTotalSpellSlots() {
    let [spellcastingLevel, pactLevel] = this.#createSpellcastingLevelArr();

    spellcastingLevel = Object.keys(spellcastingLevel).reduce(
      (total, casterType) => {
        let newLevels = [...spellcastingLevel[casterType]];

        switch (casterType) {
          case "full":
            newLevels = this.#spellcastingLevelArrToLevel(newLevels, 1, true);
            break;
          case "halfRoundUp":
            newLevels = this.#spellcastingLevelArrToLevel(newLevels, 2, true);
            break;
          case "halfRoundDown":
            newLevels = this.#spellcastingLevelArrToLevel(newLevels, 2, false);
            break;
          case "thirdRoundUp":
            newLevels = this.#spellcastingLevelArrToLevel(newLevels, 3, true);
            break;
          case "thirdRoundDown":
            newLevels = this.#spellcastingLevelArrToLevel(newLevels, 3, false);
            break;
          default:
        }

        return total + newLevels;
      },
      0
    );

    let spellSlots = new Array(9).fill(0);
    let pactSlots = new Array(9).fill(0);

    spellSlots = spellSlots.map((_, i) => {
      switch (i + 1) {
        case 1:
          return spellcastingLevel <= 0
            ? 0
            : spellcastingLevel <= 1
            ? 2
            : spellcastingLevel <= 2
            ? 3
            : 4;
        case 2:
          return spellcastingLevel <= 2 ? 0 : spellcastingLevel <= 3 ? 2 : 3;
        case 3:
          return spellcastingLevel <= 4 ? 0 : spellcastingLevel <= 4 ? 2 : 3;
        case 4:
          return spellcastingLevel <= 6
            ? 0
            : spellcastingLevel <= 7
            ? 1
            : spellcastingLevel <= 8
            ? 2
            : 3;
        case 5:
          return spellcastingLevel <= 8
            ? 0
            : spellcastingLevel <= 9
            ? 1
            : spellcastingLevel <= 17
            ? 2
            : 3;
        case 6:
          return spellcastingLevel <= 10 ? 0 : spellcastingLevel <= 18 ? 1 : 2;
        case 7:
          return spellcastingLevel <= 12 ? 0 : spellcastingLevel <= 19 ? 1 : 2;
        case 8:
          return spellcastingLevel <= 14 ? 0 : 1;
        case 9:
          return spellcastingLevel <= 16 ? 0 : 1;
        default:
          return 0;
      }
    });

    pactSlots = pactSlots.map((_, i) => {
      switch (i + 1) {
        case 1:
          return pactLevel === 1 ? 1 : pactLevel === 2 ? 2 : 0;
        case 2:
          return pactLevel >= 3 && pactLevel <= 4 ? 2 : 0;
        case 3:
          return pactLevel >= 5 && pactLevel <= 6 ? 2 : 0;
        case 4:
          return pactLevel >= 7 && pactLevel <= 8 ? 2 : 0;
        case 5:
          return pactLevel <= 8
            ? 0
            : pactLevel <= 10
            ? 2
            : pactLevel <= 16
            ? 3
            : 4;
        default:
          return 0;
      }
    });

    let totalSlots = spellSlots.map((count, i) => count + pactSlots[i]);
    const category = "SpellSlotsMax";
    const bonuses = this.#getEffects(category);
    bonuses.forEach((bonus) => {
      const effect = bonus.effects.find(
        (checkEffect) => checkEffect.category === category
      );
      effect.changes.slots.forEach((extras, i) => {
        totalSlots[i] += extras;
      });
    });

    return totalSlots;
  }

  #createSpellcastingLevelArr() {
    let spellcastingLevel = {
      full: [],
      halfRoundUp: [],
      halfRoundDown: [],
      thirdRoundUp: [],
      thirdRoundDown: [],
    };
    let pactLevel = 0;

    this.spellcasting.sources.forEach((src) => {
      if (!src.class) {
        return;
      }
      const classLevel = this.classes.find(
        (checkClass) => checkClass.className === src.class
      ).classLevel;

      switch (src.class) {
        case "Bard":
        case "Cleric":
        case "Druid":
        case "Sorcerer":
        case "Wizard":
          spellcastingLevel.full.push(classLevel);
          break;
        case "Artificer":
          spellcastingLevel.halfRoundUp.push(classLevel);
          break;
        case "Paladin":
        case "Ranger":
          if (this.spellcasting.sources.length === 1) {
            spellcastingLevel.halfRoundUp.push(classLevel);
          } else {
            spellcastingLevel.halfRoundDown.push(classLevel);
          }
          break;
        case "Fighter":
        case "Rogue":
          if (this.spellcasting.sources.length === 1) {
            spellcastingLevel.thirdRoundUp.push(classLevel);
          } else {
            spellcastingLevel.thirdRoundDown.push(classLevel);
          }
          break;
        case "Warlock":
          pactLevel = classLevel;
          break;
        default:
      }
    });

    return [spellcastingLevel, pactLevel];
  }

  #spellcastingLevelArrToLevel(levelsArr, divideBy, roundUp) {
    if (this.spellcasting.roundBeforeAdding) {
      levelsArr = levelsArr.map((level) =>
        roundUp ? Math.ceil(level / divideBy) : Math.floor(level / divideBy)
      );
    }
    let newLevel = levelsArr.reduce((total, val) => total + val, 0);
    if (!this.spellcasting.roundBeforeAdding) {
      newLevel = roundUp
        ? Math.ceil(newLevel / divideBy)
        : Math.floor(newLevel / divideBy);
    }

    return newLevel;
  }

  getExpendedSpellSlots() {
    return this.spellcasting.spellSlotsExpended.map(
      (slots, i) => slots + this.spellcasting.pactSlotsExpended[i]
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
      if (spell.components.m.costly) {
        hoverIcons.push(["gold_cost.png", "Material Component with Gold Cost"]);
      }
      if (spell.components.m.consumed) {
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

  getSpellsPreparedCounts() {
    const preppedSpellsByClass = {};
    this.spellcasting.spellsKnown.forEach((spell) => {
      if (!spell.class) {
        return;
      }
      if (spell.prepared === 1) {
        if (!(spell.class in preppedSpellsByClass)) {
          preppedSpellsByClass[spell.class] = 0;
        }
        preppedSpellsByClass[spell.class]++;
      }
    });

    const prepared = {};
    this.spellcasting.sources.forEach((src) => {
      if (!src.class) {
        return;
      }
      const castClass = this.classes.find(
        (checkClass) => checkClass.className === src.class
      );

      let maxPrepped = 1;
      switch (castClass.className) {
        case "Cleric":
        case "Druid":
        case "Wizard":
          maxPrepped = this.getAbilityMod(src.ability) + castClass.classLevel;
          break;
        case "Artificer":
        case "Paladin":
          maxPrepped =
            this.getAbilityMod(src.ability) +
            Math.floor(castClass.classLevel / 2);
          break;
        default:
          return;
      }
      if (maxPrepped < 1) {
        maxPrepped = 1;
      }

      prepared[castClass.className] = {
        maxPrepped: maxPrepped,
        currentPrepped: preppedSpellsByClass[castClass.className],
      };
    });

    return prepared;
  }

  getSpellComponents(spell) {
    const comps = spell.components;
    const compsArr = [];
    if (comps.v) compsArr.push("V");
    if (comps.s) compsArr.push("S");
    if (comps.m) compsArr.push(`M (${comps.m.text})`);
    return compsArr.join(", ");
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

  #getEffects(category) {
    return this.#getFeatureEffects(category)
      .concat(this.#getBuffEffects(category))
      .concat(this.#getItemEffects(category));
  }
}

export default Character;
