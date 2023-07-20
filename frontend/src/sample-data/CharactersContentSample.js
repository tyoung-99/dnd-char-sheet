const characters = [
  {
    // General
    id: 1,
    name: "Name",
    player: "Player",
    alignment: "Alignment",
    xp: "XP",
    inspiration: false,

    // Combat stats
    armor_class: 10,
    initiative: 2,
    speeds: {
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
      successes: 0,
      failures: 0,
    },

    // Abilities/skills
    // For skill profs, 0 = normal, 1 = proficiency, 2 = expertise
    prof_bonus: 2,
    stats: {
      str: {
        score: 10,
        save_prof: true,
        skill_profs: {
          athletics: 0,
        },
      },
      dex: {
        score: 11,
        save_prof: false,
        skill_profs: {
          acrobatics: 0,
          sleight_of_hand: 0,
          stealth: 0,
        },
      },
      con: {
        score: 12,
        save_prof: true,
        skill_profs: {},
      },
      int: {
        score: 13,
        save_prof: false,
        skill_profs: {
          arcana: 0,
          history: 0,
          investigation: 0,
          nature: 0,
          religion: 0,
        },
      },
      wis: {
        score: 14,
        save_prof: false,
        skill_profs: {
          animal_handling: 0,
          insight: 0,
          medicine: 0,
          perception: 0,
          survival: 0,
        },
      },
      cha: {
        score: 15,
        save_prof: false,
        skill_profs: {
          deception: 0,
          intimidation: 0,
          performance: 0,
          persuasion: 0,
        },
      },
    },
    passive_perception: 12,

    // Other profs
    weapons: ["Weapon 1", "Weapon 2"],
    armor: ["Armor 1", "Armor 2"],
    tools: ["Tool 1", "Tool 2"],
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
      name: "Race",
      subrace: "Subrace",
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
