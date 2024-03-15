// Represents 1 character and all its data, performs various calculations on data to allow easier external access to elements of character that depend on other elements

import axios from "axios";
import Timer from "./Timer";

class Character {
  static async create(newCharData, setShowingSavedMessage) {
    // Get this reference data when char created to avoid calls to backend during operation

    const weaponProfGroups = (await axios.get("/api/proficiencies/weapons"))
      .data;
    const armorProfGroups = (await axios.get("/api/proficiencies/armor")).data;

    const race = newCharData.race.raceId
      ? (await axios.get(`/api/races/${newCharData.race.raceId}`)).data
      : null;
    await Character.#raceReplaceIdsWithData(race, newCharData.featureChoices);

    const subrace = newCharData.race.subraceId
      ? (await axios.get(`/api/subraces/${newCharData.race.subraceId}`)).data
      : null;
    await Character.#raceReplaceIdsWithData(
      subrace,
      newCharData.featureChoices
    );

    return new Character(
      newCharData,
      setShowingSavedMessage,
      weaponProfGroups,
      armorProfGroups,
      race,
      subrace
    );
  }

  static async #raceReplaceIdsWithData(race, featureChoices) {
    race.source = (await axios.get(`/api/sources/${race.source}`)).data;

    if (race.features.length > 0) {
      race.features = (
        await axios.get(`/api/racialFeatures/multiple/${race.features}`)
      ).data;
    }

    // Combining required/chosen effects of racial features/nested feats here simplifies using that data later
    for (const feature of race.features) {
      if (!feature.effects) continue;

      for (const effect of feature.effects) {
        if (
          featureChoices.race[feature._id] &&
          featureChoices.race[feature._id][effect.category]
        ) {
          effect.changes = Character.#combineEffectChoices(
            effect.category,
            effect.changes.required,
            featureChoices.race[feature._id][effect.category]
          );
        } else {
          effect.changes = effect.changes.required;
        }
      }

      const featIndex = feature.effects.findIndex(
        (effect) => effect.category === "Feat"
      );

      if (featIndex < 0) continue;

      if (feature.effects[featIndex].changes.join() === "") {
        feature.effects[featIndex].changes = null;
        continue;
      }

      feature.effects[featIndex].changes = (
        await axios.get(
          `/api/feats/multiple/${feature.effects[featIndex].changes}`
        )
      ).data;

      for (const feat of feature.effects[featIndex].changes) {
        for (const featEffect of feat.effects) {
          if (
            featureChoices.feat[feat._id] &&
            featureChoices.feat[feat._id][featEffect.category]
          ) {
            featEffect.changes = Character.#combineEffectChoices(
              featEffect.category,
              featEffect.changes.required,
              featureChoices.feat[feat._id][featEffect.category]
            );
          } else {
            featEffect.changes = featEffect.changes.required;
          }
        }
      }
    }
  }

  static #combineEffectChoices(category, required, choicesMade) {
    let combined = structuredClone(required);

    if (!combined) {
      combined = structuredClone(choicesMade);
    } else {
      switch (category) {
        case "AbilityScore":
          combined.forEach((ability) => {
            ability.amount += choicesMade.find(
              (checkAbility) => (checkAbility.ability = ability.ability)
            ).amount;
          });
          break;

        case "Language":
        case "SkillProficiency":
        case "SkillExpertise":
        case "Feat":
          combined = combined.concat(structuredClone(choicesMade));
          break;

        default:
      }
    }

    return combined;
  }

  constructor(
    newCharData,
    setShowingSavedMessage,
    ref_weaponProfGroups,
    ref_armorProfGroups,
    ref_race,
    ref_subrace
  ) {
    Object.assign(this, newCharData);

    this.queueSave = Timer(this.saveCharacter, 5000);
    this.setShowingSavedMessage = setShowingSavedMessage;
    this.ref_weaponProfGroups = ref_weaponProfGroups;
    this.ref_armorProfGroups = ref_armorProfGroups;
    this.ref_race = ref_race;
    this.ref_subrace = ref_subrace;
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

  setAlignment(newAlignment) {
    this.alignment = newAlignment;
    this.saveCharacter();
  }

  setXp(newXp) {
    this.xp.amount = newXp;
    this.saveCharacter();
  }

  setInspiration(newInspiration) {
    this.inspiration = newInspiration;
    this.saveCharacter();
  }

  setDeathSaves(successCount, failCount) {
    this.deathSaves.successes = successCount;
    this.deathSaves.failures = failCount;
    this.saveCharacter();
  }

  async setRace(newRace, newSubrace, newFeatureChoices) {
    this.race.raceId = newRace.id;
    this.race.subraceId = newSubrace.id;
    this.featureChoices = newFeatureChoices;

    this.ref_race = newRace.id
      ? (await axios.get(`/api/races/${newRace.id}`)).data
      : null;
    await Character.#raceReplaceIdsWithData(this.ref_race, this.featureChoices);

    this.ref_subrace = newSubrace.id
      ? (await axios.get(`/api/subraces/${newSubrace.id}`)).data
      : null;
    await Character.#raceReplaceIdsWithData(
      this.ref_subrace,
      this.featureChoices
    );

    this.saveCharacter();
  }

  spendHitDie(sides) {
    this.usedHitDice.find((checkDice) => checkDice.sides === sides).number += 1;
    this.saveCharacter();
  }

  restoreHitDie(sides) {
    this.usedHitDice.find((checkDice) => checkDice.sides === sides).number -= 1;
    this.saveCharacter();
  }

  dealDamage(amount) {
    const dmgLeft = amount - this.hitPoints.temp;
    if (dmgLeft >= 0) {
      this.hitPoints.temp = 0;
      this.hitPoints.currentBase -= dmgLeft;

      const [totalCurrent] = this.getCurrentHitPoints();
      if (totalCurrent < 0) this.hitPoints.currentBase -= totalCurrent;
    } else {
      this.hitPoints.temp -= amount;
    }
    this.saveCharacter();
  }

  restoreHitPoints(amount) {
    this.hitPoints.currentBase += amount;
    const [totalCurrent] = this.getCurrentHitPoints(),
      [totalMax] = this.getMaxHitPoints();
    if (totalCurrent > totalMax) {
      this.hitPoints.currentBase -= totalCurrent - totalMax;
    }
    this.saveCharacter();
  }

  replaceTempHitPoints(amount) {
    if (amount < 0) amount = 0;
    this.hitPoints.temp = amount;
    this.saveCharacter();
  }

  setMaxHitPointsBase(amount) {
    const change = amount - this.hitPoints.maxBase;
    this.hitPoints.maxBase += change;
    this.hitPoints.currentBase += change;
    this.saveCharacter();
  }

  setPointBuy(newPointBuy) {
    this.abilities.pointBuy = newPointBuy;
    this.saveCharacter();
  }

  setAbilityScores(newAbilities) {
    newAbilities.forEach((ability) => {
      this.abilities.values.find(
        (checkAbility) => checkAbility.name === ability.name
      ).score = ability.breakdown[0].val;
    });
    this.saveCharacter();
  }

  getAbilities() {
    return this.abilities.values.map((ability) => {
      const [score, breakdown] = this.getAbilityScore(ability.name);
      return {
        name: ability.name,
        score: score,
        mod: this.getAbilityMod(ability.name),
        breakdown: breakdown,
      };
    });
  }

  getAbilityScore(ability) {
    const combineBonuses = (bonuses) =>
      bonuses.reduce(
        (total, elem) => {
          let val = 0;

          const matchingEffect = elem.effects.find(
            (checkEffect) => checkEffect.category === category
          );
          if (matchingEffect) {
            const abilityBonus = matchingEffect.changes.find(
              (checkAbility) => checkAbility.ability === ability
            );
            val +=
              abilityBonus &&
              (!abilityBonus.cap ||
                val + abilityBonus.amount <= abilityBonus.cap)
                ? abilityBonus.amount
                : 0;

            breakdown.push({
              val: val,
              label: elem.displayName || elem.name,
              obtainedFrom: elem.race || elem.class || elem.background,
            });
          }

          const featEffect = elem.effects.find(
            (checkEffect) => checkEffect.category === "Feat"
          );
          if (featEffect) {
            val += combineBonuses(featEffect.changes);
          }

          return total + val;
        },

        0
      );

    const category = "AbilityScore";
    const score = this.abilities.values.find(
      (stat) => stat.name === ability
    ).score;
    const breakdown = [
      {
        val: score,
        label: "Base",
      },
    ];
    const bonuses = combineBonuses(this.#getEffects(category));
    return [score + bonuses, breakdown];
  }

  getAbilityMod(ability) {
    return Math.floor((this.getAbilityScore(ability)[0] - 10) / 2);
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
    const skills = [
      {
        name: "Athletics",
        prof: 0,
        mod: { flat: 0, dice: [] },
        ability: "STR",
      },
      {
        name: "Acrobatics",
        prof: 0,
        mod: { flat: 0, dice: [] },
        ability: "DEX",
      },
      {
        name: "Sleight of Hand",
        prof: 0,
        mod: { flat: 0, dice: [] },
        ability: "DEX",
      },
      {
        name: "Stealth",
        prof: 0,
        mod: { flat: 0, dice: [] },
        ability: "DEX",
      },
      {
        name: "Arcana",
        prof: 0,
        mod: { flat: 0, dice: [] },
        ability: "INT",
      },
      {
        name: "History",
        prof: 0,
        mod: { flat: 0, dice: [] },
        ability: "INT",
      },
      {
        name: "Investigation",
        prof: 0,
        mod: { flat: 0, dice: [] },
        ability: "INT",
      },
      {
        name: "Nature",
        prof: 0,
        mod: { flat: 0, dice: [] },
        ability: "INT",
      },
      {
        name: "Religion",
        prof: 0,
        mod: { flat: 0, dice: [] },
        ability: "INT",
      },
      {
        name: "Animal Handling",
        prof: 0,
        mod: { flat: 0, dice: [] },
        ability: "WIS",
      },
      {
        name: "Insight",
        prof: 0,
        mod: { flat: 0, dice: [] },
        ability: "WIS",
      },
      {
        name: "Medicine",
        prof: 0,
        mod: { flat: 0, dice: [] },
        ability: "WIS",
      },
      {
        name: "Perception",
        prof: 0,
        mod: { flat: 0, dice: [] },
        ability: "WIS",
      },
      {
        name: "Survival",
        prof: 0,
        mod: { flat: 0, dice: [] },
        ability: "WIS",
      },
      {
        name: "Deception",
        prof: 0,
        mod: { flat: 0, dice: [] },
        ability: "CHA",
      },
      {
        name: "Intimidation",
        prof: 0,
        mod: { flat: 0, dice: [] },
        ability: "CHA",
      },
      {
        name: "Performance",
        prof: 0,
        mod: { flat: 0, dice: [] },
        ability: "CHA",
      },
      {
        name: "Persuasion",
        prof: 0,
        mod: { flat: 0, dice: [] },
        ability: "CHA",
      },
    ];

    let category = "SkillProficiency";
    this.#getSkillsHelper(category, (newProf) => {
      skills.find((checkSkill) => checkSkill.name === newProf).prof = 1; // Mark prof as 1, expertise as 2, so prof bonus can be multiplied by prof val
    });

    category = "SkillExpertise";
    this.#getSkillsHelper(category, (newExp) => {
      const affectedSkill = skills.find(
        (checkSkill) => checkSkill.name === newExp
      );
      if (affectedSkill.prof >= 1) affectedSkill.prof = 2;
      else {
        affectedSkill.error = `Ineligible for ${affectedSkill.name} expertise`;
      }
    });

    category = "SkillModifier";
    this.#getSkillsHelper(category, (newMod) => {
      const affectedSkill = skills.find(
        (checkSkill) => checkSkill.name === newMod.skillName
      );
      affectedSkill.mod += newMod.flat;
      this.#addDiceToArr(affectedSkill.mod.dice, newMod.dice);
    });

    skills.forEach((skill) => {
      skill.mod.flat +=
        this.getAbilityMod(skill.ability) + this.getProfBonus() * skill.prof;
    });

    skills.sort((first, second) =>
      first.name > second.name ? 1 : first.name === second.name ? 0 : -1
    );

    return skills;
  }

  #getSkillsHelper(category, callback) {
    const combineBonuses = (bonuses) => {
      bonuses.forEach((effectsList) => {
        let effect = effectsList.effects.find(
          (checkEffect) => checkEffect.category === category
        );
        if (effect.changes.join() === "") return;
        if (effect.changes) effect.changes.forEach(callback);

        effect = effectsList.effects.find(
          (checkEffect) => checkEffect.category === "Feat"
        );
        if (effect) combineBonuses(effect.changes);
      });
    };

    combineBonuses(this.#getEffects(category));
  }

  getSkillByName(skill) {
    return this.getSkills().find((checkSkill) => checkSkill.name === skill);
  }

  getPassivePerception() {
    const combineBonuses = (bonuses) =>
      bonuses.reduce(
        (total, elem) =>
          total +
          elem.effects.reduce((subtotal, effect) => {
            if (effect.category === category) {
              subtotal += effect.changes.bonus;
            } else if (effect.category === "Feat") {
              subtotal += combineBonuses(effect.changes);
            }
            return subtotal;
          }, 0),
        0
      );

    const category = "PassivePerception";

    return (
      10 +
      this.getSkillByName("Perception").mod.flat +
      combineBonuses(this.#getEffects(category))
    );
  }

  getSaves() {
    const saves = this.abilities.values.map((ability) => {
      const abilityMod = this.getAbilityMod(ability.name);
      return {
        name: ability.name,
        prof: false,
        mod: abilityMod,
        profBreakdown: [],
        bonusBreakdown: [
          {
            val: abilityMod,
            label: "Ability Modifier",
            obtainedFrom: null,
          },
        ],
      };
    });

    const [saveProfs, profBreakdown] = this.#getSaveProfBonuses();
    const profBonus = this.getProfBonus();
    saveProfs.forEach((ability) => {
      const current = saves.find((checkSave) => checkSave.name === ability);
      current.prof = true;
      current.mod += profBonus;
    });
    saves.forEach((save) => {
      save.profBreakdown = profBreakdown;
      save.bonusBreakdown = save.bonusBreakdown.concat({
        val: profBonus * save.prof,
        label: "Proficiency",
        obtainedFrom: null,
      });
    });

    const [bonuses, bonusBreakdown] = this.#getSaveModBonuses();
    Object.keys(bonuses).forEach((ability) => {
      const current = saves.find((checkSave) => checkSave.name === ability);
      current.mod += bonuses[ability];
      current.bonusBreakdown = current.bonusBreakdown.concat(bonusBreakdown);
    });

    return saves;
  }

  #getSaveProfBonuses() {
    const combineBonuses = (bonuses) => {
      let saves = [];
      bonuses.forEach((elem) => {
        const matchingEffect = elem.effects.find(
          (checkEffect) => checkEffect.category === category
        );
        if (matchingEffect) {
          saves = saves.concat(matchingEffect.changes);
          breakdown.push({
            saves: matchingEffect.changes,
            label: elem.displayName || elem.name,
            obtainedFrom: elem.race || elem.class || elem.background,
          });
        }

        const featEffect = elem.effects.find(
          (checkEffect) => checkEffect.category === "Feat"
        );
        if (featEffect) {
          saves = saves.concat(combineBonuses(featEffect.changes));
        }
      });

      return [...new Set(saves)];
    };

    const category = "SaveProficiency";
    const breakdown = [];
    const bonuses = combineBonuses(this.#getEffects(category));
    return [bonuses, breakdown];
  }

  #getSaveModBonuses() {
    // TODO: Update w/ getEffects() after putting save mod feature in  (don't forget to check feats)

    // const category = "SavingThrowModifier";
    // const bonuses = this.#getEffects(category);
    const bonusesParsed = {
      STR: 0,
      DEX: 0,
      CON: 0,
      INT: 0,
      WIS: 0,
      CHA: 0,
    };

    // bonuses.forEach((bonus) => {
    //   const effect = bonus.effects.find(
    //     (checkEffect) => checkEffect.category === category
    //   );
    //   if (effect.changes.flat) {
    //     Object.keys(effect.changes.flat).forEach((ability) => {
    //       bonusesParsed[ability] += effect.changes.flat[ability];
    //     });
    //   }
    // });

    return [bonusesParsed, []];
  }

  getWeaponProfs() {
    return this.#filterProfGroups(
      this.#getWeaponProfsUnfiltered(),
      this.ref_weaponProfGroups
    );
  }

  #getWeaponProfsUnfiltered() {
    let profsList = [];

    // TODO: Update w/ getEffects() after putting weapon prof feature in  (don't forget to check feats)

    profsList = [...new Set(profsList)];
    return profsList;
  }

  getArmorProfs() {
    return this.#filterProfGroups(
      this.#getArmorProfsUnfiltered(),
      this.ref_armorProfGroups
    );
  }

  #getArmorProfsUnfiltered() {
    let profsList = [];

    // TODO: Update w/ getEffects() after putting armor prof feature in  (don't forget to check feats)

    profsList = [...new Set(profsList)];
    return profsList;
  }

  #filterProfGroups(profsList, groups) {
    groups.forEach((group) => {
      if (group.profs.every((prof) => profsList.includes(prof))) {
        profsList = profsList.filter((prof) => !group.profs.includes(prof));
        profsList.push(group.name);
      }
    });
    return profsList;
  }

  getToolProfs() {
    let profsList = [];

    // TODO: Update w/ getEffects() after putting tool prof feature in  (don't forget to check feats)

    return [...new Set(profsList)];
  }

  getLanguages() {
    let languages = [];
    const category = "Language";

    const combineBonuses = (bonuses) =>
      bonuses.forEach((langEffect) => {
        let effect = langEffect.effects.find(
          (checkEffect) => checkEffect.category === category
        );
        languages = languages.concat(effect.changes);

        effect = langEffect.effects.find(
          (checkEffect) => checkEffect.category === "Feat"
        );
        if (effect) combineBonuses(effect.changes);
      });

    combineBonuses(this.#getEffects(category));

    return [...new Set(languages)];
  }

  isProficientWithItem(item) {
    return item.profRequired.some(
      (prof) =>
        this.#getWeaponProfsUnfiltered().includes(prof) ||
        this.#getArmorProfsUnfiltered().includes(prof) ||
        this.getToolProfs().includes(prof)
    );
  }

  getInitiative() {
    // TODO: Update w/ getEffects() after putting init feature in  (don't forget to check feats)
    let breakdown = "";
    let bonuses = [];

    const dexMod = this.getAbilityMod("DEX");
    bonuses.unshift(dexMod);
    breakdown = `${dexMod} (DEX)` + breakdown;

    bonuses = bonuses.reduce((total, bonus) => (total += bonus), 0);

    return [bonuses, breakdown];
  }

  getArmorClass() {
    // TODO: Update w/ getEffects() after putting AC feature in  (don't forget to check feats)

    // Compare every currently legal AC calculation, select highest
    let replacements = [],
      bonuses = [];
    const category = "ArmorClass";
    const options = this.#getEffects(category);

    options.forEach((option) => {
      const effect = option.effects.find(
        (checkEffect) => checkEffect.category === category
      );

      const name = option.displayName ? option.displayName : option.name;

      if (effect.changes.replace) {
        replacements.push({ ...effect.changes, name: name });
      } else if (effect.changes.bonus) {
        bonuses.push({ ...effect.changes, name: name });
      }
    });

    let replacementsBreakdown, bonusesBreakdown;
    [replacements, replacementsBreakdown] =
      this.#validateArmorClassReplacements(replacements);
    [bonuses, bonusesBreakdown] = this.#validateArmorClassBonuses(bonuses);

    return [replacements + bonuses, replacementsBreakdown + bonusesBreakdown];
  }

  #validateArmorClassReplacements(replacements) {
    const breakdown = new Array(replacements.length).fill("");
    const equippedItems = this.getEquippedItems();
    replacements = replacements.map((option, i) => {
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

      breakdown[i] = `${option.replace.base} (${option.name})`;

      const mods = option.replace.mods.map((mod, j) => {
        let val = this.getAbilityMod(mod);
        if (option.replace.modCaps && val > option.replace.modCaps[j]) {
          val = option.replace.modCaps[j];
        }
        if (val !== 0) breakdown[i] += this.#breakdownValToStr(val, mod);
        return val;
      });

      return option.replace.base + mods.reduce((total, mod) => total + mod);
    });

    if (!equippedItems.some((item) => item.type === "Armor")) {
      const dexMod = this.getAbilityMod("DEX");
      replacements.push(10 + dexMod);
      if (dexMod !== 0) {
        breakdown.push(
          `10 (Unarmored)` + this.#breakdownValToStr(dexMod, "DEX")
        );
      } else breakdown.push(`10 (Unarmored)`);
    }

    // Custom max index finder b/c it does fewer calculations than indexof(max())
    const findMaxIndex = (arr) => {
      if (arr.length === 0) {
        return -1;
      }

      let max = arr[0];
      let maxIndex = 0;

      for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
          maxIndex = i;
          max = arr[i];
        }
      }

      return maxIndex;
    };

    const maxIndex = findMaxIndex(replacements);

    return [replacements[maxIndex], breakdown[maxIndex]];
  }

  #validateArmorClassBonuses(bonuses) {
    let breakdown = "";
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
        if (val > option.bonus.modCaps[i]) {
          val = option.bonus.modCaps[i];
        }
        if (val !== 0) {
          breakdown += this.#breakdownValToStr(val, `${option.name}: ${mod}`);
        }
        return val;
      });
      mods.push(option.bonus.flat);
      if (option.bonus.flat !== 0) {
        breakdown += this.#breakdownValToStr(option.bonus.flat, option.name);
      }
      mods = mods.reduce((total, mod) => total + mod);

      return mods;
    });

    bonuses = bonuses.reduce((total, bonus) => total + bonus, 0);
    return [bonuses, breakdown];
  }

  getSpeeds() {
    const category = "Speed";
    const modifiers = { walk: 0, swim: 0, fly: 0 };
    const multipliers = { walk: 1, swim: 1, fly: 1 };

    const combineBonuses = (bonuses) =>
      bonuses.forEach((bonus) => {
        let effect = bonus.effects.find(
          (checkEffect) => checkEffect.category === category
        );
        Object.keys(effect.changes).forEach((speedType) => {
          modifiers[speedType] += effect.changes[speedType].modifier || 0;
          multipliers[speedType] *= effect.changes[speedType].multiplier || 1;
        });

        effect = bonus.effects.find(
          (checkEffect) => checkEffect.category === "Feat"
        );
        if (effect) combineBonuses(effect.changes);
      });

    combineBonuses(this.#getEffects(category));

    /* RAW doesn't address order of operations, using modifiers before multipliers 
    b/c it's consistent w/ how damage resistance is handled, and it makes modifiers 
    consistent in effect, rather than being devestating or negligible, as they would 
    when applied after a halving/doubling of speed, respectively.

    This also allows base speed to be just a modifier w/in a feature, since all modifiers are added first. */
    Object.keys(modifiers).forEach((speedType) => {
      modifiers[speedType] *= multipliers[speedType];
    });

    return modifiers;
  }

  getMaxHitPoints() {
    let [modifiers, breakdown] = this.#getHitPointsHelper("MaxHitPoints");

    const cumulativeConMod =
      this.getAbilityMod("CON") *
      this.classes.reduce(
        (total, charClass) => total + charClass.classLevel,
        0
      );

    breakdown =
      `${this.hitPoints.maxBase} (Base)` +
      this.#breakdownValToStr(cumulativeConMod, "CON x lvl") +
      breakdown;

    return [this.hitPoints.maxBase + cumulativeConMod + modifiers, breakdown];
  }

  getCurrentHitPoints() {
    let [modifiers, breakdown] = this.#getHitPointsHelper("CurrentHitPoints");
    breakdown = `${this.hitPoints.currentBase} (Base)` + breakdown;
    return [this.hitPoints.currentBase + modifiers, breakdown];
  }

  #getHitPointsHelper(category) {
    const combineBonuses = (bonuses) =>
      bonuses.reduce(
        (total, elem) => {
          const val = elem.effects.reduce((subtotal, effect) => {
            if (effect.category === category) {
              subtotal += effect.changes.bonus;
            } else if (effect.category === "Feat") {
              subtotal += combineBonuses(effect.changes);
            }
            return subtotal;
          }, 0);

          breakdown += this.#breakdownValToStr(val, elem.name);
          return total + val;
        },

        0
      );

    let breakdown = "";
    const bonuses = combineBonuses(this.#getEffects(category));

    return [bonuses, breakdown];
  }

  getCurrentHitDice() {
    const [current] = this.getTotalHitDice();
    this.usedHitDice.forEach(
      (usedDie) =>
        (current.find(
          (currentDie) => currentDie.sides === usedDie.sides
        ).number -= usedDie.number)
    );
    return current;
  }

  getTotalHitDice() {
    // TODO: Update w/ getEffects() after putting hit dice feature in (are there any?) (don't forget to check feats)

    let breakdown = "";
    let total = [];
    this.classes.forEach((charClass) => {
      if (breakdown !== "") breakdown += " + ";
      breakdown += `${charClass.classLevel}d${charClass.hitDie} (${charClass.className})`;

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
    return [total, breakdown];
  }

  getAttack(item) {
    return [this.#getAttackMod(item), this.#getAttackDamage(item)];
  }

  #getAttackMod(item) {
    // TODO: Update w/ getEffects() after putting attack mod features in (don't forget to check feats)

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
    // TODO: Update w/ getEffects() after putting attack damage features in (don't forget to check feats)

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

  getFeatures(
    { fromClass, fromRace, fromBackground } = {
      fromClass: true,
      fromRace: true,
      fromBackground: true,
    }
  ) {
    let features = [];

    if (fromClass) {
      features = features.concat(this.#getClassFeatures());
    }
    if (fromRace) {
      features = features.concat(this.#getRaceFeatures());
    }
    if (fromBackground) {
      features = features.concat(this.#getBackgroundFeatures());
    }

    return features;
  }

  #getClassFeatures() {
    // TODO: Update w/ getEffects() after putting class features in (don't forget to check feats)

    let features = [];
    return features;
  }

  #getRaceFeatures() {
    if (!this.ref_race) return [];

    const raceFeatures = structuredClone(this.ref_race.features);
    raceFeatures.forEach((feature) => {
      feature.race = this.ref_race.name;
    });

    if (!this.ref_subrace) return raceFeatures;

    const subraceFeatures = structuredClone(this.ref_subrace.features);

    subraceFeatures.forEach((feature) => {
      feature.race = this.ref_subrace.displayName;

      feature.replaces.forEach((replaceId) => {
        const index = raceFeatures.findIndex(
          (checkFeature) => checkFeature._id === replaceId
        );
        if (index >= 0) {
          raceFeatures.splice(index, 1);
        }
      });
    });

    return raceFeatures.concat(subraceFeatures);
  }

  #getBackgroundFeatures() {
    // TODO: Update w/ getEffects() after putting background features in (don't forget to check feats)

    let features = [];
    return features;
  }

  #getFeatureEffects(category) {
    const temp = this.getFeatures().filter((feature) => {
      if (!feature.effects) return false;

      const hasMatchingCategory = feature.effects.some(
        (effect) => effect.category === category
      );

      let hasMatchingFeat = false;
      const featIndex = feature.effects.findIndex(
        (effect) => effect.category === "Feat"
      );
      if (featIndex >= 0) {
        hasMatchingFeat =
          feature.effects[featIndex].changes &&
          feature.effects[featIndex].changes.some((feat) =>
            feat.effects.some((effect) => effect.category === category)
          );
      }

      return hasMatchingCategory || hasMatchingFeat;
    });

    return temp;
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
    // TODO: Update w/ getEffects() after putting spell bonus features in (don't forget to check feats)

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
    // TODO: Update w/ getEffects() after putting spell slot features in (don't forget to check feats)

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

  getFeats() {
    const category = "Feat";
    let feats = [];

    this.#getEffects(category).forEach((elem) => {
      const featEffect = elem.effects.find(
        (effect) => effect.category === category
      );
      feats = feats.concat(featEffect.changes);
    });

    return feats;
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

  #breakdownValToStr(val, label) {
    let str = val !== 0 ? `${Math.abs(val)} (${label})` : "";
    if (val > 0) {
      str = " + " + str;
    } else if (val < 0) {
      str = " - " + str;
    }
    return str;
  }
}

export default Character;
