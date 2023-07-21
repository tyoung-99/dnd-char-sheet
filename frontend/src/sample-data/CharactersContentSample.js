const characters = [
  {
    // General
    id: 1,
    name: "Character Name",
    player: "Player Name",
    alignment: "Lawful Good",
    xp: "XP",
    inspiration: false,

    // Combat stats
    armor_class: 10,
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
    hit_dice: {
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
    death_saves: {
      successes: 2,
      failures: 1,
    },

    // Abilities/skills
    // For skill profs, 0 = normal, 1 = proficiency, 2 = expertise
    prof_bonus: 2,
    stats: [
      {
        name: "STR",
        score: 8,
        save_prof: true,
        skill_profs: [{ name: "Athletics", proficiency: 2 }],
      },
      {
        name: "DEX",
        score: 10,
        save_prof: false,
        skill_profs: [
          { name: "Acrobatics", proficiency: 1 },
          { name: "Sleight of Hand", proficiency: 0 },
          { name: "Stealth", proficiency: 0 },
        ],
      },
      { name: "CON", score: 12, save_prof: true, skill_profs: [] },
      {
        name: "INT",
        score: 13,
        save_prof: false,
        skill_profs: [
          { name: "Arcana", proficiency: 0 },
          { name: "History", proficiency: 0 },
          { name: "Investigation", proficiency: 0 },
          { name: "Nature", proficiency: 0 },
          { name: "Religion", proficiency: 0 },
        ],
      },
      {
        name: "WIS",
        score: 14,
        save_prof: false,
        skill_profs: [
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
        save_prof: false,
        skill_profs: [
          { name: "Deception", proficiency: 0 },
          { name: "Intimidation", proficiency: 0 },
          { name: "Performance", proficiency: 1 },
          { name: "Persuasion", proficiency: 2 },
        ],
      },
    ],
    passive_perception: 12,

    // Other profs
    weapon_profs: ["Weapon 1", "Weapon 2"],
    armor_profs: ["Armor 1", "Armor 2"],
    tool_profs: ["Tool 1", "Tool 2"],
    languages: ["Language 1", "Language 2"],

    // Backstory
    backstory: [`Backstory`, `multiple`, `paragraphs`],
    background: {
      name: "Background",
      feature: "Feature",
      trait_1: "Trait 1",
      trait_2: "Trait 2",
      ideal: "Ideal",
      bond: "Bond",
      flaw: "Flaw",
    },

    // Race (only include traits that don't fall elsewhere - e.g. don't include speed, do include darkvision)
    race: {
      name: "Human",
      subrace: null,
      traits: [
        { name: "Race trait 1", description: "Race trait 1 description" },
        { name: "Race trait 2", description: "Race trait 2 description" },
      ],
    },

    // Class(es)
    classes: [
      {
        className: "Fighter",
        classLevel: 3,
        features: [
          {
            name: "Fighter trait 1",
            description: "Fighter trait 1 description",
          },
          {
            name: "Fighter trait 2",
            description: "Fighter trait 2 description",
          },
        ],
      },
      {
        className: "Wizard",
        classLevel: 2,
        features: [
          { name: "Wizard trait 1", description: "Wizard trait 1 description" },
          { name: "Wizard trait 2", description: "Wizard trait 2 description" },
        ],
      },
    ],

    // Shared features
    spellcasting: {
      caster_level: 2,
      slots_max: [3, 0, 0, 0, 0, 0, 0, 0, 0],
      slots_current: [1, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    pact_magic: {
      pact_level: 0,
      slots_max: [0, 0, 0, 0, 0],
      slots_current: [0, 0, 0, 0, 0],
    },

    // Equipment/gp
    equipment: [],
    coins: { cp: 0, sp: 1, ep: 2, gp: 3, pp: 4 },
  },
];

export default characters;
