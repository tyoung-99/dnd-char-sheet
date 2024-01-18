const characters = [
  {
    id: 1,
    name: "Character Name",
    player: "Player Name",
    alignment: "Lawful Good",
    xp: 2500,
    inspiration: false,

    armorClass: 10,
    initiative: 2,
    speed: {
      walk: 30,
      swim: 5,
      fly: 0,
    },
    hp: {
      current: 10,
      max: 14,
      temp: 2,
    },
    hitDice: {
      total: [
        {
          number: 3,
          faces: 10,
        },
        {
          number: 2,
          faces: 6,
        },
      ],
      remaining: [
        {
          number: 1,
          faces: 10,
        },
        {
          number: 1,
          faces: 6,
        },
      ],
    },
    deathSaves: {
      successes: 2,
      failures: 1,
    },

    profBonus: 2,
    stats: [
      {
        name: "STR",
        score: 18,
        saveProf: true,
        skillProfs: [{ name: "Athletics", proficiency: 2 }],
      },
      {
        name: "DEX",
        score: 10,
        saveProf: false,
        skillProfs: [
          { name: "Acrobatics", proficiency: 1 },
          { name: "Sleight of Hand", proficiency: 0 },
          { name: "Stealth", proficiency: 0 },
        ],
      },
      { name: "CON", score: 12, saveProf: true, skillProfs: [] },
      {
        name: "INT",
        score: 13,
        saveProf: false,
        skillProfs: [
          { name: "Arcana", proficiency: 0 },
          { name: "History", proficiency: 0 },
          { name: "Investigation", proficiency: 0 },
          { name: "Nature", proficiency: 0 },
          { name: "Religion", proficiency: 0 },
        ],
      },
      {
        name: "WIS",
        score: 6,
        saveProf: false,
        skillProfs: [
          { name: "Animal Handling", proficiency: 0 },
          { name: "Insight", proficiency: 0 },
          { name: "Medicine", proficiency: 0 },
          { name: "Perception", proficiency: 0 },
          { name: "Survival", proficiency: 0 },
        ],
      },
      {
        name: "CHA",
        score: 16,
        saveProf: false,
        skillProfs: [
          { name: "Deception", proficiency: 0 },
          { name: "Intimidation", proficiency: 0 },
          { name: "Performance", proficiency: 1 },
          { name: "Persuasion", proficiency: 2 },
        ],
      },
    ],
    passivePerception: 12,

    weaponProfs: ["Dagger", "Shortsword", "Light Crossbow"],
    armorProfs: ["Armor 1", "Armor 2"],
    toolProfs: ["Tool 1", "Tool 2"],
    languages: ["Language 1", "Language 2"],

    backstory: ["Backstory", "multiple", "paragraphs"],
    background: {
      name: "Background Name",
      feature: "Feature",
      personalityTraits: ["Trait 1", "Trait 2"],
      ideals: ["Ideal", "P2"],
      bonds: ["Bond", "P2"],
      flaws: ["Flaw", "P2"],
    },

    race: {
      name: "Human",
      subrace: null,
    },

    // Class(es)
    classes: [
      {
        className: "Fighter",
        classLevel: 3,
      },
      {
        className: "Wizard",
        classLevel: 2,
      },
    ],

    equipment: [
      { name: "Backpack", count: 1, type: "Storage" },
      {
        name: "Potion of Healing",
        count: 2,
        type: "Consumable",
        subtype: "Potion",
        equipped: true,
      },
      {
        name: "Oil of Slipperiness",
        count: 2,
        type: "Consumable",
        subtype: "Potion",
        equipped: true,
      },
      { name: "Tinderbox", count: 1, type: "Tool" },
      {
        name: "Longsword",
        profRequired: ["Longsword"],
        count: 1,
        type: "Weapon",
        subtypes: ["Melee", "Martial"],
        properties: ["Versatile (1d10)"],
        damage: { dice: 1, sides: 8, type: "slashing" },
        equipped: true,
      },
      {
        name: "Bolt",
        count: 12,
        type: "Consumable",
        subtype: "Ammunition",
        equipped: true,
      },
      {
        name: "Shortsword",
        profRequired: ["Shortsword"],
        count: 3,
        type: "Weapon",
        subtypes: ["Melee", "Martial"],
        properties: ["Finesse", "Light"],
        damage: { dice: 1, sides: 6, type: "piercing" },
        equipped: true,
      },
      {
        name: "Arrow",
        count: 5,
        type: "Consumable",
        subtype: "Ammunition",
        equipped: true,
      },
      {
        name: "Flame Tongue Shortsword",
        profRequired: ["Shortsword"],
        count: 1,
        type: "Weapon",
        subtypes: ["Melee", "Martial"],
        properties: ["Finesse", "Light"],
        damage: { dice: 1, sides: 6, type: "piercing" },
        equipped: true,
        activated: true,
        activation: { damage: { dice: 2, sides: 6, type: "fire" } },
      },
      {
        name: "Light Crossbow",
        profRequired: ["Light Crossbow"],
        count: 1,
        type: "Weapon",
        subtypes: ["Ranged", "Simple"],
        properties: ["Ammunition (Range 80/320)", "Loading", "Two-Handed"],
        damage: { dice: 1, sides: 8, type: "piercing" },
        equipped: true,
      },
      {
        name: "Sun Blade",
        profRequired: ["Longsword", "Shortsword"],
        count: 1,
        type: "Weapon",
        subtypes: ["Melee", "Martial"],
        properties: ["Versatile (1d10)"],
        damage: { dice: 1, sides: 8, type: "slashing" },
        equipped: true,
        bonus: 2,
      },
    ],
    coins: { cp: 0, sp: 1, ep: 2, gp: 3, pp: 4 },

    spellcasting: {
      level: 2,
      slotsMax: [3, 0, 0, 0, 0, 0, 0, 0, 0],
      slotsCurrent: [1, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    pactMagic: {
      level: 0,
      slotsMax: [0, 0, 0, 0, 0],
      slotsCurrent: [0, 0, 0, 0, 0],
    },
  },
];

export default characters;
