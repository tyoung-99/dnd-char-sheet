const characters = [
  {
    id: 1,
    name: "Test Char",
    player: "Jane Doe",
    avatarSrc: "2.png",
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

    backstory: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc faucibus nisi turpis, ut pulvinar justo tempus fermentum. Sed vestibulum ac nulla eget dictum. Nulla blandit quam risus, in convallis lectus ultrices sed. Pellentesque non magna eu ipsum pharetra vulputate. Sed placerat sapien malesuada, faucibus lacus tristique, faucibus massa. Praesent vel nisi pulvinar, pellentesque elit quis, eleifend turpis. Pellentesque a erat ultrices, sagittis lorem sit amet, ullamcorper turpis. Aliquam imperdiet nulla et orci molestie, sollicitudin facilisis ante elementum. Duis vehicula sollicitudin rutrum. Nullam nec condimentum arcu, in congue risus. Suspendisse ut lectus nisi.",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc faucibus nisi turpis, ut pulvinar justo tempus fermentum. Sed vestibulum ac nulla eget dictum. Nulla blandit quam risus, in convallis lectus ultrices sed. Pellentesque non magna eu ipsum pharetra vulputate. Sed placerat sapien malesuada, faucibus lacus tristique, faucibus massa. Praesent vel nisi pulvinar, pellentesque elit quis, eleifend turpis. Pellentesque a erat ultrices, sagittis lorem sit amet, ullamcorper turpis. Aliquam imperdiet nulla et orci molestie, sollicitudin facilisis ante elementum. Duis vehicula sollicitudin rutrum. Nullam nec condimentum arcu, in congue risus. Suspendisse ut lectus nisi.ltiple",
      "In eget magna nibh. Morbi ultrices, nunc sit amet volutpat sollicitudin, sem turpis tincidunt erat, eget molestie mi felis id tortor. Donec nec ligula et nibh feugiat aliquet. Quisque scelerisque orci eget justo bibendum egestas. Nullam ut ante sit amet eros facilisis tempus vel ac nulla. Sed aliquet at purus sit amet commodo. Donec non eleifend nunc. Proin sollicitudin facilisis vulputate. Vestibulum nisl urna, vestibulum a pharetra vel, congue non neque. Integer eu quam sit amet nulla luctus posuere.",
    ],
    background: {
      name: "Baldur's Gate Acolyte",
      personalityTraits: [
        "I idolize a particular hero of my faith, and constantly refer to that person's deeds and example.",
        "I can find common ground between the fiercest enemies, empathizing with them and always working towards peace.",
      ],
      ideals: [
        "Tradition. The ancient traditions of worship and sacrifice must be preserved and upheld.",
      ],
      bonds: [
        "I would die to recover an ancient relic of my faith that was lost long ago.",
      ],
      flaws: ["I judge others harshly, and myself even more severely."],
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
      {
        name: "Carved bone statuette",
        count: 4,
        type: "Treasure",
        value: 10,
      },
      {
        name: "Pair of engraved bone dice",
        count: 1,
        type: "Treasure",
        value: 100,
      },
      {
        name: "Black velvet mask stitched with silver thread",
        count: 3,
        type: "Treasure",
        value: 1,
      },
      {
        name: "Copper chalice with silver filigree",
        count: 3,
        type: "Treasure",
        value: 50,
      },
      {
        name: "Silver ewer",
        count: 5,
        type: "Treasure",
        value: 1000,
      },
    ],
    coins: { cp: 0, sp: 1, ep: 2, gp: 3, pp: 4 },

    appearance: {
      age: "25 years",
      height: "5 ft 4 in",
      weight: "234 lbs",
      eyes: "blue",
      skin: "red",
      hair: "white",
      desc: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc faucibus nisi turpis, ut pulvinar justo tempus fermentum. Sed vestibulum ac nulla eget dictum. Nulla blandit quam risus, in convallis lectus ultrices sed. Pellentesque non magna eu ipsum pharetra vulputate. Sed placerat sapien malesuada, faucibus lacus tristique, faucibus massa. Praesent vel nisi pulvinar, pellentesque elit quis, eleifend turpis. Pellentesque a erat ultrices, sagittis lorem sit amet, ullamcorper turpis. Aliquam imperdiet nulla et orci molestie, sollicitudin facilisis ante elementum. Duis vehicula sollicitudin rutrum. Nullam nec condimentum arcu, in congue risus. Suspendisse ut lectus nisi.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc faucibus nisi turpis, ut pulvinar justo tempus fermentum. Sed vestibulum ac nulla eget dictum. Nulla blandit quam risus, in convallis lectus ultrices sed. Pellentesque non magna eu ipsum pharetra vulputate. Sed placerat sapien malesuada, faucibus lacus tristique, faucibus massa. Praesent vel nisi pulvinar, pellentesque elit quis, eleifend turpis. Pellentesque a erat ultrices, sagittis lorem sit amet, ullamcorper turpis. Aliquam imperdiet nulla et orci molestie, sollicitudin facilisis ante elementum. Duis vehicula sollicitudin rutrum. Nullam nec condimentum arcu, in congue risus. Suspendisse ut lectus nisi.ltiple",
        "In eget magna nibh. Morbi ultrices, nunc sit amet volutpat sollicitudin, sem turpis tincidunt erat, eget molestie mi felis id tortor. Donec nec ligula et nibh feugiat aliquet. Quisque scelerisque orci eget justo bibendum egestas. Nullam ut ante sit amet eros facilisis tempus vel ac nulla. Sed aliquet at purus sit amet commodo. Donec non eleifend nunc. Proin sollicitudin facilisis vulputate. Vestibulum nisl urna, vestibulum a pharetra vel, congue non neque. Integer eu quam sit amet nulla luctus posuere.",
      ],
    },

    allies: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc faucibus nisi turpis, ut pulvinar justo tempus fermentum. Sed vestibulum ac nulla eget dictum. Nulla blandit quam risus, in convallis lectus ultrices sed. Pellentesque non magna eu ipsum pharetra vulputate. Sed placerat sapien malesuada, faucibus lacus tristique, faucibus massa. Praesent vel nisi pulvinar, pellentesque elit quis, eleifend turpis. Pellentesque a erat ultrices, sagittis lorem sit amet, ullamcorper turpis. Aliquam imperdiet nulla et orci molestie, sollicitudin facilisis ante elementum. Duis vehicula sollicitudin rutrum. Nullam nec condimentum arcu, in congue risus. Suspendisse ut lectus nisi.",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc faucibus nisi turpis, ut pulvinar justo tempus fermentum. Sed vestibulum ac nulla eget dictum. Nulla blandit quam risus, in convallis lectus ultrices sed. Pellentesque non magna eu ipsum pharetra vulputate. Sed placerat sapien malesuada, faucibus lacus tristique, faucibus massa. Praesent vel nisi pulvinar, pellentesque elit quis, eleifend turpis. Pellentesque a erat ultrices, sagittis lorem sit amet, ullamcorper turpis. Aliquam imperdiet nulla et orci molestie, sollicitudin facilisis ante elementum. Duis vehicula sollicitudin rutrum. Nullam nec condimentum arcu, in congue risus. Suspendisse ut lectus nisi.ltiple",
      "In eget magna nibh. Morbi ultrices, nunc sit amet volutpat sollicitudin, sem turpis tincidunt erat, eget molestie mi felis id tortor. Donec nec ligula et nibh feugiat aliquet. Quisque scelerisque orci eget justo bibendum egestas. Nullam ut ante sit amet eros facilisis tempus vel ac nulla. Sed aliquet at purus sit amet commodo. Donec non eleifend nunc. Proin sollicitudin facilisis vulputate. Vestibulum nisl urna, vestibulum a pharetra vel, congue non neque. Integer eu quam sit amet nulla luctus posuere.",
    ],
    symbolSrc: "1.png",

    abilities: [
      {
        name: "Shelter of the Faithful",
        background: "Baldur's Gate Acolyte",
        desc: [
          "As an acolyte, you command the respect of those who share your faith, and you can perform the religious ceremonies of your deity. You and your adventuring companions can expect to receive free healing and care at a temple, shrine, or other established presence of your faith, though you must provide any material components needed for spells. Those who share your religion will support you (but only you) at a modest lifestyle.",
          "You might also have ties to a specific temple dedicated to your chosen deity or pantheon, and you have a residence there. This could be the temple where you used to serve, if you remain on good terms with it, or a temple where you have found a new home. While near your temple, you can call upon the priests for assistance, provided the assistance you ask for is not hazardous and you remain in good standing with your temple.",
        ],
      },
      {
        name: "Religious Community",
        background: "Baldur's Gate Acolyte",
        desc: [
          "The effects of a Baldur's Gate feature can be used only while the character is in Baldur's Gate — though, at the DM's discretion, they might have applicable effects in situations similar to those in Baldur's Gate.",
          "You're tightly connected with the religious community of Baldur's Gate. You know if a deity has a following in the city and any places that faith openly congregates and the neighborhoods those faithful typically inhabit. While this isn't remarkable for most of the city's larger faiths, keeping track of the hundreds of religions newcomers bring with them is no mean feat.",
        ],
      },
      {
        name: "Size",
        race: "Human",
        desc: [
          "Humans vary widely in height and build, from barely 5 feet to well over 6 feet tall. Regardless of your position in that range, your size is Medium.",
        ],
      },
      {
        name: "Second Wind",
        class: "Fighter",
        desc: [
          "You have a limited well of stamina that you can draw on to protect yourself from harm. On your turn, you can use a bonus action to regain hit points equal to 1d10 + your fighter level.",
          "Once you use this feature, you must finish a short or long rest before you can use it again.",
        ],
      },
      {
        name: "Improved Critical",
        class: "Fighter",
        subclass: "Champion",
        desc: [
          "Beginning when you choose this archetype at 3rd level, your weapon attacks score a critical hit on a roll of 19 or 20.",
        ],
      },
      {
        name: "Actor",
        feat: "Actor",
        desc: [
          "Skilled at mimicry and dramatics, you gain the following benefits:",
          "Increase your Charisma score by 1, to a maximum of 20.",
          "You have an advantage on Deception and Performance checks when trying to pass yourself off as a different person.",
          "You can mimic the speech of another person or the sounds made by other creatures. You must have heard the person speaking, or heard the creature make the sound, for at least 1 minute. A successful Insight check contested by your Deception check allows a listener to determine that the effect is faked.",
        ],
      },
    ],

    spellcasting: {
      classes: [
        { name: "Wizard", ability: "INT", saveDC: 13, attackBonus: 5 },
        { name: "Fighter", ability: "INT", saveDC: 13, attackBonus: 5 },
      ],
      spellSlots: {
        level: 2,
        slotsTotal: [3, 0, 0, 0, 0, 0, 0, 0, 0],
        slotsExpended: [1, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      pactSlots: {
        level: 0,
        slotsTotal: [0, 0, 0, 0, 0],
        slotsExpended: [0, 0, 0, 0, 0],
      },
      spellsKnown: [
        {
          name: "Chromatic Orb",
          level: 1,
          school: "Evocation",
          ritual: false,
          castTime: "1 action",
          range: "90 feet",
          components: {
            v: true,
            s: true,
            m: [
              {
                name: "a diamond",
                value: { count: 50, coin: "gp" },
                consumed: false,
              },
            ],
          },
          duration: "Instantaneous",
          concentration: false,
          description: [
            "You hurl a 4-inch-diameter sphere of energy at a creature that you can see within range. You choose acid, cold, fire, lightning, poison, or thunder for the type of orb you create, and then make a ranged spell attack against the target. If the attack hits, the creature takes 3d8 damage of the type you chose.",
          ],
          upcast: [
            "When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d8 for each slot level above 1st.",
          ],
          class: "Wizard",
          prepared: 1,
        },
        {
          name: "Beast Bond",
          level: 1,
          school: "Divination",
          ritual: false,
          castTime: "1 action",
          range: "Touch",
          components: {
            v: true,
            s: true,
            m: [
              {
                name: "a bit of fur wrapped in a cloth",
                value: false,
                consumed: false,
              },
            ],
          },
          duration: "Concentration, up to 10 minutes",
          concentration: true,
          description: [
            "You establish a telepathic link with one beast you touch that is friendly to you or charmed by you. The spell fails if the beast's Intelligence score is 4 or higher. Until the spell ends, the link is active while you and the beast are within line of sight of each other. Through the link, the beast can understand your telepathic messages to it, and it can telepathically communicate simple emotions and concepts back to you. While the link is active, the beast gains advantage on attack rolls against any creature within 5 feet of you that you can see.",
          ],
          upcast: false,
          feat: "Fey Touched",
          prepared: 2,
        },
        {
          name: "Misty Step",
          level: 2,
          school: "Conjuration",
          ritual: false,
          castTime: "1 bonus action",
          range: "Self",
          components: {
            v: true,
            s: false,
            m: false,
          },
          duration: "Instantaneous",
          concentration: false,
          description: [
            "Briefly surrounded by silvery mist, you teleport up to 30 feet to an unoccupied space that you can see.",
          ],
          upcast: false,
          feat: "Fey Touched",
          prepared: 2,
        },
        {
          name: "Fire Bolt",
          level: 0,
          school: "Evocation",
          ritual: false,
          castTime: "1 action",
          range: "120 feet",
          components: {
            v: true,
            s: true,
            m: false,
          },
          duration: "Instantaneous",
          concentration: false,
          description: [
            "You hurl a mote of fire at a creature or object within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 fire damage. A flammable object hit by this spell ignites if it isn't being worn or carried.",
            "This spell's damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10).",
          ],
          upcast: false,
          class: "Wizard",
          prepared: 2,
        },
        {
          name: "Gentle Repose",
          level: 2,
          school: "Necromancy",
          ritual: true,
          castTime: "1 action",
          range: "Touch",
          components: {
            v: true,
            s: true,
            m: [
              {
                name: "a pinch of salt and one copper piece placed on each of the corpse's eyes, which must remain there for the duration",
                value: false,
                consumed: false,
              },
            ],
          },
          duration: "10 days",
          concentration: false,
          description: [
            "You touch a corpse or other remains. For the duration, the target is protected from decay and can't become undead.",
            "The spell also effectively extends the time limit on raising the target from the dead, since days spent under the influence of this spell don't count against the time limit of spells such as Raise Dead.",
          ],
          upcast: false,
          class: "Wizard",
          prepared: 0,
        },
        {
          name: "Gentle Repose",
          level: 2,
          school: "Necromancy",
          ritual: true,
          castTime: "1 action",
          range: "Touch",
          components: {
            v: true,
            s: true,
            m: [
              {
                name: "a pinch of salt and one copper piece placed on each of the corpse's eyes, which must remain there for the duration",
                value: false,
                consumed: false,
              },
            ],
          },
          duration: "10 days",
          concentration: false,
          description: [
            "You touch a corpse or other remains. For the duration, the target is protected from decay and can't become undead.",
            "The spell also effectively extends the time limit on raising the target from the dead, since days spent under the influence of this spell don't count against the time limit of spells such as Raise Dead.",
          ],
          upcast: false,
          class: "Cleric",
          prepared: 0,
        },
      ],
      concentration: { name: "Beast Bond", roundsLeft: 17 },
    },
  },
];

export default characters;
