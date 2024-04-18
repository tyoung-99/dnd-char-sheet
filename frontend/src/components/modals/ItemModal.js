// Modal to view/edit item details

import { useState, Fragment, useEffect } from "react";
import axios from "axios";
import GenericModal from "./GenericModal";
import EditorConvertToJSON from "../EditorConvertToJSON";
import "../../styling/components/modals/ItemModal.css";

const ItemModal = ({
  character,
  setCharChangeFlag,
  closeModal,
  item,
  isTreasure,
}) => {
  const PROPERTIES = {
    Ammunition:
      "You can use a weapon that has the ammunition property to make a ranged attack only if you have ammunition to fire from the weapon. Each time you attack with the weapon, you expend one piece of ammunition. Drawing the ammunition from a quiver, case, or other container is part of the attack (you need a free hand to load a one-handed weapon). At the end of the battle, you can recover half your expended ammunition by taking a minute to search the battlefield. If you use a weapon that has the ammunition property to make a melee attack, you treat the weapon as an improvised weapon. A sling must be loaded to deal any damage when used in this way.",
    Finesse:
      "When making an attack with a finesse weapon, you use your choice of your Strength or Dexterity modifier for the attack and damage rolls. You must use the same modifier for both rolls.",
    Heavy:
      "Creatures that are Small or Tiny have disadvantage on attack rolls with heavy weapons. A heavy weapon's size and bulk make it too large for a Small or Tiny creature to use effectively.",
    Light:
      "A light weapon is small and easy to handle, making it ideal for use when fighting with two weapons.",
    Loading:
      "Because of the time required to load this weapon, you can fire only one piece of ammunition from it when you use an action, bonus action, or reaction to fire it, regardless of the number of attacks you can normally make.",
    Range:
      "A weapon that can be used to make a ranged attack has a range shown in parentheses after the ammunition or thrown property. The range lists two numbers. The first is the weapon's normal range in feet, and the second indicates the weapon's long range. When attacking a target beyond normal range, you have disadvantage on the attack roll. You can't attack a target beyond the weapon's long range.",
    Reach:
      "This weapon adds 5 feet to your reach when you attack with it. This property also determines your reach for opportunity attacks with a reach weapon.",
    Thrown:
      "If a weapon has the thrown property, you can throw the weapon to make a ranged attack. If the weapon is a melee weapon, you use the same ability modifier for that attack roll and damage roll that you would use for a melee attack with the weapon. For example, if you throw a handaxe, you use your Strength, but if you throw a dagger, you can use either your Strength or your Dexterity, since the dagger has the finesse property.",
    "Two-Handed":
      "This weapon requires two hands to use. This property is relevant only when you attack with the weapon, not when you simply hold it.",
    Versatile:
      "This weapon can be used with one or two hands. A damage value in parentheses appears with the property-the damage when the weapon is used with two hands to make a melee attack.",
    Lance:
      "You have disadvantage when you use a lance to attack a target within 5 feet of you. Also, a lance requires two hands to wield when you aren't mounted.",
    Net: "A Large or smaller creature hit by a net is restrained until it is freed. A net has no effect on creatures that are formless, or creatures that are Huge or larger. A creature can use its action to make a DC 10 Strength check, freeing itself or another creature within its reach on a success. Dealing 5 slashing damage to the net (AC 10) also frees the creature without harming it, ending the effect and destroying the net. When you use an action, bonus action, or reaction to attack with a net, you can make only one attack regardless of the number of attacks you can normally make.",
    "Double-Bladed Scimitar":
      "The double scimitar is an expensive weapon, but few people ever even get the opportunity to purchase one. If you're an elf, your blade could have a long and storied history. If you're not an elf, you might have stolen the weapon or received it from a dying ally. If you work with your DM to create the story behind your double scimitar, you can start with the weapon at 1st level in place of a martial weapon normally granted by your class. When you make a two-handed attack with this weapon, you can use a bonus action to make a melee attack with the other side of the blade. This attack uses the same ability modifier as the primary. The damage die is 1d4, and it deals slashing damage. This special attack can only be done if you take the Attack action.",
    "Stealth Disadvantage":
      "You have disadvantage on Dexterity (Stealth) checks while wearing this armor.",
  };

  const ITEM_TYPES = {
    "Adventuring Gear": null,
    Armor: ["Light", "Medium", "Heavy", "Shield"],
    Consumable: ["Ammunition", "Food/Drink", "Poison", "Potion", "Scroll"],
    Mount: null,
    Other: null,
    Ring: null,
    "Spellcasting Focus": [
      "Crystal",
      "Orb",
      "Rod",
      "Staff",
      "Wand",
      "Sprig of Mistletoe",
      "Totem",
      "Amulet",
      "Emblem",
      "Reliquary",
    ],
    Storage: null,
    "Tack/Harness": null,
    Tattoo: null,
    Tool: ["Artisan's Tool", "Gaming Set", "Instrument", "Generic Tool"],
    "Trade Good": null,
    Vehicle: ["Land", "Air", "Space", "Water"],
    Weapon: ["Martial", "Melee", "Ranged", "Simple", "Firearm"],
    "Wondrous Item": null,
  };

  const DAMAGE_TYPES = [
    "bludgeoning",
    "piercing",
    "slashing",
    "acid",
    "cold",
    "fire",
    "force",
    "lightning",
    "necrotic",
    "poison",
    "psychic",
    "radiant",
    "thunder",
  ];

  const DAMAGE_TEMPLATE = {
    dice: [
      {
        number: 1,
        sides: 2,
      },
    ],
    flat: 0,
    type: "bludgeoning",
  };

  const ITEM_TEMPLATE = isTreasure
    ? {
        name: "New Treasure",
        count: 1,
        types: ["Treasure"],
        value: [
          ["cp", 0],
          ["sp", 0],
          ["ep", 0],
          ["gp", 0],
          ["pp", 0],
        ],
        description: {
          blocks: [
            {
              key: "6ccsg",
              text: "",
              type: "unstyled",
              depth: 0,
              inlineStyleRanges: [],
              entityRanges: [],
              data: {},
            },
          ],
          entityMap: {},
        },
        profRequired: [],
        properties: [],
      }
    : {
        name: "New Item",
        count: 1,
        toggles: {
          Equipped: false,
        },
        types: ["Adventuring Gear"],
        subtypes: [null],
        description: {
          blocks: [
            {
              key: "6ccsg",
              text: "",
              type: "unstyled",
              depth: 0,
              inlineStyleRanges: [],
              entityRanges: [],
              data: {},
            },
          ],
          entityMap: {},
        },
        profRequired: [],
        properties: [],
      };

  const isNew = !item;

  const [editing, setEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(
    structuredClone(isNew ? ITEM_TEMPLATE : item)
  );

  const [profTypes, setProfTypes] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const profsList = (await axios.get("/api/proficiencies/all")).data.reduce(
        (groupedList, profGroup) => {
          const combinedName = `${profGroup.profType} (${profGroup.name})`;
          groupedList[combinedName] = profGroup.profs;
          return groupedList;
        },
        {}
      );
      setProfTypes(profsList);
    };
    loadData();
  }, []);

  const saveAndClose = () => {
    if (isNew) character.addItem(currentItem);
    else character.replaceItem(item, currentItem);
    setCharChangeFlag((old) => !old);
    closeModal();
  };

  const combineBreakdown = (breakdown) => {
    return breakdown.map((entry, i) => {
      let internalText = "";

      if (i !== 0) {
        internalText += " + ";
      }

      if (entry.val.dice.length > 0) {
        entry.val.dice.forEach((die, i) => {
          if (i > 0) internalText += " + ";
          internalText += `${die.number}d${die.sides}`;
        });
        if (entry.val.flat) {
          if (entry.val.flat < 0) internalText += " - ";
          else internalText += " + ";
        }
      }

      if (entry.val.flat) {
        internalText += `${Math.abs(entry.val.flat)}`;
      }

      if (entry.type) {
        internalText += ` (${entry.type})`;
      }

      internalText += ` (${entry.label})`;

      return (
        <span key={i} title={entry.obtainedFrom || ""}>
          {internalText}
        </span>
      );
    });
  };

  const isJsonEditorEmpty = (textJson) => {
    if (!textJson) return true;
    if (textJson.entityMap && Object.keys(textJson.entityMap).length > 0)
      return false;
    if (textJson.blocks) {
      for (const block of textJson.blocks) {
        if (block.text !== "") {
          return false;
        }
      }
    }
    return true;
  };

  const header = (
    <>
      <h1>
        {editing ? (
          <input
            type="text"
            className="item-name"
            id="itemName"
            name="itemName"
            value={currentItem.name}
            onChange={(event) =>
              setCurrentItem((oldItem) => {
                const newItem = { ...oldItem };
                newItem.name = event.target.value;
                return newItem;
              })
            }
          ></input>
        ) : (
          currentItem.name
        )}
      </h1>
      <img
        src={
          process.env.PUBLIC_URL +
          `/icons/edit${editing ? "_selected" : ""}.png`
        }
        alt=""
        className="edit-item"
        onClick={() => setEditing(!editing)}
      ></img>
    </>
  );

  let typeSection,
    amountSection,
    equippedSection,
    attunedSection,
    proficiencySection,
    propertiesSection,
    attackSection,
    twoHandedSection,
    activatedSection,
    descriptionSection,
    valueSection;

  amountSection = (
    <span>
      <label htmlFor="itemCount">Amount: </label>
      <input
        type="number"
        id="itemCount"
        name="itemCount"
        value={currentItem.count}
        min={0}
        onChange={(e) =>
          setCurrentItem((oldItem) => {
            const newItem = { ...oldItem };
            newItem.count = parseInt(e.target.value);
            return newItem;
          })
        }
      ></input>
    </span>
  );

  descriptionSection = (
    <>
      <p>Additional information:</p>
      {isJsonEditorEmpty(currentItem.description) && !editing ? (
        <p>-None-</p>
      ) : (
        <EditorConvertToJSON
          readOnly={!editing}
          toolbarHidden={!editing}
          wrapperClassName={editing && "wysiwyg-textbox-wrapper"}
          editorClassName="wysiwyg-textbox-editor"
          onBlur={(contentJSON) =>
            setCurrentItem((oldItem) => {
              const newItem = { ...oldItem };
              newItem.description = contentJSON;
              return newItem;
            })
          }
          defaultTextJSON={currentItem.description}
        />
      )}
    </>
  );

  if (isTreasure) {
    valueSection = (
      <div className="col-flex">
        <label htmlFor="">Value: </label>
        <div className="row-flex">
          {currentItem.value.map((coin, i) => (
            <span key={i}>
              <label htmlFor={`val${coin[0].toUpperCase()}`}>
                {coin[0].toUpperCase()}:{" "}
              </label>
              <input
                type="number"
                id={`val${coin[0].toUpperCase()}`}
                name={`val${coin[0].toUpperCase()}`}
                value={coin[1]}
                min={0}
                onChange={(e) =>
                  setCurrentItem((oldItem) => {
                    const newItem = { ...oldItem };
                    newItem.value[i][1] = parseInt(e.target.value);
                    return newItem;
                  })
                }
              ></input>
            </span>
          ))}
        </div>
      </div>
    );
  } else {
    let attackMod, attackModBreakdown, damage, damageBreakdown;
    if (currentItem.types.includes("Weapon")) {
      [[attackMod, attackModBreakdown], [damage, damageBreakdown]] =
        character.getAttack(currentItem);
    }

    const typeSelector = currentItem.types.map((type, i) => (
      <span key={i}>
        <select
          name={`type${i}`}
          id={`type${i}`}
          value={type}
          onChange={(event) => {
            setCurrentItem((oldItem) => {
              const newItem = { ...oldItem };
              const newType = event.target.value;
              const oldType = newItem.types[i];
              newItem.types[i] = newType;
              newItem.subtypes[i] = ITEM_TYPES[newType] ? [] : null;
              if (newType === "Weapon") {
                newItem.damage = structuredClone({ base: [DAMAGE_TEMPLATE] });

                if (typeof newItem.toggles.Activated === "boolean") {
                  newItem.damage.activated = [];
                }

                newItem.attackBonus = 0;
              } else if (oldType === "Weapon") {
                newItem.damage = undefined;
                newItem.attackBonus = undefined;
              }
              return newItem;
            });
          }}
        >
          <option hidden value={""}>
            Select type
          </option>
          {Object.keys(ITEM_TYPES).map((refType) => {
            if (currentItem.types.includes(refType) && refType !== type)
              return null;
            return (
              <option key={refType} value={refType}>
                {refType}
              </option>
            );
          })}
        </select>{" "}
        {ITEM_TYPES[type] && (
          <>
            Subtypes:{" "}
            {currentItem.subtypes[i].map((subtype, j) => (
              <Fragment key={j}>
                {j > 0 && ", "}
                <span
                  className="click-to-remove"
                  onClick={() =>
                    setCurrentItem((oldItem) => {
                      const newItem = { ...oldItem };
                      newItem.subtypes[i].splice(j, 1);
                      return newItem;
                    })
                  }
                >
                  {subtype}
                </span>
              </Fragment>
            ))}{" "}
            <select
              name={`type${i}Subtype`}
              id={`type${i}Subtype`}
              value={""}
              onChange={(event) =>
                setCurrentItem((oldItem) => {
                  const newItem = { ...oldItem };
                  newItem.subtypes[i].push(event.target.value);
                  newItem.subtypes[i].sort();
                  return newItem;
                })
              }
            >
              <option hidden value={""}>
                Add subtype
              </option>
              {ITEM_TYPES[type].map((refSubtype) => {
                if (currentItem.subtypes[i].includes(refSubtype)) return null;
                return (
                  <option key={refSubtype} value={refSubtype}>
                    {refSubtype}
                  </option>
                );
              })}
            </select>
          </>
        )}{" "}
        {i > 0 && (
          <button
            className="x-button"
            title="Remove item type"
            onClick={() =>
              setCurrentItem((oldItem) => {
                const newItem = { ...oldItem };
                newItem.types.splice(i, 1);
                newItem.subtypes.splice(i, 1);
                return newItem;
              })
            }
          >
            X
          </button>
        )}
      </span>
    ));

    typeSection = editing ? (
      <>
        <label className="col-flex" htmlFor="">
          <span>
            Type: (First type determines sorting){" "}
            <button
              id="addItemType"
              name="addItemType"
              onClick={() =>
                setCurrentItem((oldItem) => {
                  const newItem = { ...oldItem };
                  newItem.types.push("");
                  newItem.subtypes.push([]);
                  return newItem;
                })
              }
            >
              Add type
            </button>
          </span>
          {typeSelector}
        </label>
      </>
    ) : (
      <p>
        Type:{" "}
        {currentItem.types.map(
          (type, i) =>
            `${i > 0 ? ", " : ""}${type}${
              currentItem.subtypes[i]
                ? ` (${currentItem.subtypes[i].join(", ")})`
                : ""
            }`
        )}
      </p>
    );

    equippedSection = typeof currentItem.toggles.Equipped === "boolean" && (
      <span>
        <label htmlFor={"equipped"}>Equipped: </label>
        <button
          id={"equipped"}
          name={"equipped"}
          onClick={() =>
            setCurrentItem((oldItem) => {
              const newItem = { ...oldItem };
              newItem.toggles.Equipped = !newItem.toggles.Equipped;
              return newItem;
            })
          }
        >
          {currentItem.toggles.Equipped ? "Yes" : "No"}
        </button>
      </span>
    );

    attunedSection = (typeof currentItem.toggles.Attuned === "boolean" ||
      editing) && (
      <span>
        {editing && (
          <>
            <label htmlFor={"attunable"}>Attunable: </label>
            <button
              id={"attunable"}
              name={"attunable"}
              onClick={() =>
                setCurrentItem((oldItem) => {
                  const newItem = { ...oldItem };
                  if (typeof newItem.toggles.Attuned === "boolean") {
                    newItem.toggles.Attuned = undefined;
                  } else {
                    newItem.toggles.Attuned = false;
                  }
                  return newItem;
                })
              }
            >
              {typeof currentItem.toggles.Attuned === "boolean" ? "Yes" : "No"}
            </button>{" "}
          </>
        )}
        {typeof currentItem.toggles.Attuned === "boolean" && (
          <>
            <label htmlFor={"attuned"}>Attuned: </label>
            <button
              id={"attuned"}
              name={"attuned"}
              onClick={() =>
                setCurrentItem((oldItem) => {
                  const newItem = { ...oldItem };
                  newItem.toggles.Attuned = !newItem.toggles.Attuned;
                  return newItem;
                })
              }
            >
              {currentItem.toggles.Attuned ? "Yes" : "No"}
            </button>
          </>
        )}
      </span>
    );

    if (!currentItem.profRequired) currentItem.profRequired = [];

    proficiencySection = (currentItem.profRequired.length > 0 || editing) && (
      <p>
        Requires proficiency in one of:{" "}
        {editing ? (
          <>
            {currentItem.profRequired.map((prof, i) => (
              <Fragment key={i}>
                {i > 0 && ", "}
                <span
                  className="click-to-remove"
                  onClick={() =>
                    setCurrentItem((oldItem) => {
                      const newItem = { ...oldItem };
                      newItem.profRequired.splice(i, 1);
                      return newItem;
                    })
                  }
                >
                  {prof}
                </span>
              </Fragment>
            ))}{" "}
            <select
              name={`profAdder`}
              id={`profAdder`}
              value={""}
              onChange={(event) =>
                setCurrentItem((oldItem) => {
                  const newItem = { ...oldItem };
                  newItem.profRequired.push(event.target.value);
                  newItem.profRequired.sort();
                  return newItem;
                })
              }
            >
              <option hidden value={""}>
                Add proficiency
              </option>
              {Object.keys(profTypes)
                .sort()
                .map((group) => (
                  <optgroup label={group} key={group}>
                    {profTypes[group].map((prof) => {
                      if (currentItem.profRequired.includes(prof)) return null;
                      return (
                        <option key={prof} value={prof}>
                          {prof}
                        </option>
                      );
                    })}
                  </optgroup>
                ))}
            </select>
          </>
        ) : (
          currentItem.profRequired.join(", ")
        )}
      </p>
    );

    if (!currentItem.properties) currentItem.properties = [];

    propertiesSection = (currentItem.properties.length > 0 || editing) && (
      <p>
        Properties:{" "}
        {editing ? (
          <>
            {currentItem.properties.map((property, i) => (
              <Fragment key={i}>
                {i > 0 && ", "}
                <span
                  className="click-to-remove"
                  onClick={() =>
                    setCurrentItem((oldItem) => {
                      const newItem = { ...oldItem };
                      if (newItem.properties[i] === "Versatile") {
                        newItem.toggles["Two-Handed"] = undefined;
                      }
                      newItem.properties.splice(i, 1);
                      return newItem;
                    })
                  }
                  title={PROPERTIES[property]}
                >
                  {property}
                </span>
                {property === "Versatile" && (
                  <>
                    {" "}
                    (
                    <input
                      className="dice-input"
                      id="versatileDiceNumber"
                      name="versatileDiceNumber"
                      type="number"
                      min={1}
                      value={currentItem.versatileDice.number}
                      onChange={(event) => {
                        setCurrentItem((oldItem) => {
                          const newItem = { ...oldItem };
                          newItem.versatileDice.number = event.target.value;
                          return newItem;
                        });
                      }}
                    ></input>
                    d
                    <input
                      className="dice-input"
                      id="versatileDiceSides"
                      name="versatileDiceSides"
                      type="number"
                      min={2}
                      value={currentItem.versatileDice.sides}
                      onChange={(event) => {
                        setCurrentItem((oldItem) => {
                          const newItem = { ...oldItem };
                          newItem.versatileDice.sides = event.target.value;
                          return newItem;
                        });
                      }}
                    ></input>
                    )
                  </>
                )}
              </Fragment>
            ))}{" "}
            <select
              name={`propertyAdder`}
              id={`propertyAdder`}
              value={""}
              onChange={(event) =>
                setCurrentItem((oldItem) => {
                  const newItem = { ...oldItem };
                  newItem.properties.push(event.target.value);
                  newItem.properties.sort();
                  if (event.target.value === "Versatile") {
                    newItem.versatileDice = { number: 1, sides: 2 };
                    newItem.toggles["Two-Handed"] = false;
                  }
                  return newItem;
                })
              }
            >
              <option hidden value={""}>
                Add property
              </option>
              {Object.keys(PROPERTIES)
                .sort()
                .map((property) => {
                  if (currentItem.properties.includes(property)) return null;
                  return (
                    <option
                      key={property}
                      value={property}
                      title={PROPERTIES[property]}
                    >
                      {property}
                    </option>
                  );
                })}
            </select>
          </>
        ) : (
          currentItem.properties.map((property, i) => (
            <Fragment key={i}>
              {i > 0 && ", "}
              <span title={PROPERTIES[property]}>
                {property}
                {property === "Versatile" &&
                  ` (${currentItem.versatileDice.number}d${currentItem.versatileDice.sides})`}
              </span>
            </Fragment>
          ))
        )}
      </p>
    );

    const getDamageSelector = (category) => {
      if (!currentItem.types.includes("Weapon")) return null;
      return currentItem.damage[category].map((damage, i) => (
        <span key={i}>
          <select
            name={`baseDamage${i}Type`}
            id={`baseDamage${i}Type`}
            value={damage.type}
            onChange={(event) =>
              setCurrentItem((oldItem) => {
                const newItem = { ...oldItem };
                newItem.damage[category][i].type = event.target.value;
                return newItem;
              })
            }
          >
            {DAMAGE_TYPES.map((type) => {
              return (
                <option key={type} value={type}>
                  {type}
                </option>
              );
            })}
          </select>{" "}
          <input
            type="number"
            name={`baseDamage${i}Flat`}
            id={`baseDamage${i}Flat`}
            value={damage.flat}
            onChange={(event) =>
              setCurrentItem((oldItem) => {
                const newItem = { ...oldItem };
                newItem.damage[category][i].flat = parseInt(event.target.value);
                return newItem;
              })
            }
          ></input>
          {damage.dice.length > 0 && " + "}
          {damage.dice.map((die, j) => (
            <Fragment key={j}>
              {j > 0 && " + "}
              <input
                className="dice-input"
                id={`baseDamage${i}Die${j}Number`}
                name={`baseDamage${i}Die${j}Number`}
                type="number"
                min={1}
                value={die.number}
                onChange={(event) =>
                  setCurrentItem((oldItem) => {
                    const newItem = { ...oldItem };
                    newItem.damage[category][i].dice[j].number = parseInt(
                      event.target.value
                    );
                    return newItem;
                  })
                }
              ></input>
              d
              <input
                className="dice-input"
                id={`baseDamage${i}Die${j}Sides`}
                name={`baseDamage${i}Die${j}Sides`}
                type="number"
                min={2}
                value={die.sides}
                onChange={(event) =>
                  setCurrentItem((oldItem) => {
                    const newItem = { ...oldItem };
                    newItem.damage[category][i].dice[j].sides = parseInt(
                      event.target.value
                    );
                    return newItem;
                  })
                }
              ></input>{" "}
              <button
                className="x-button"
                title="Remove damage die"
                onClick={() =>
                  setCurrentItem((oldItem) => {
                    const newItem = { ...oldItem };
                    newItem.damage[category][i].dice.splice(j, 1);
                    return newItem;
                  })
                }
              >
                X
              </button>
            </Fragment>
          ))}{" "}
          <button
            id="addDamageDie"
            name="addDamageDie"
            onClick={() =>
              setCurrentItem((oldItem) => {
                const newItem = { ...oldItem };
                newItem.damage[category][i].dice.push({ number: 1, sides: 2 });
                return newItem;
              })
            }
          >
            Add die
          </button>{" "}
          {i > 0 && (
            <button
              className="x-button"
              title="Remove damage type"
              onClick={() =>
                setCurrentItem((oldItem) => {
                  const newItem = { ...oldItem };
                  newItem.damage[category].splice(i, 1);
                  return newItem;
                })
              }
            >
              X
            </button>
          )}
        </span>
      ));
    };

    const getDamageSection = (category) => {
      let labelText = "";
      if (category === "base") {
        labelText =
          "Base Damage: (Ability modifier will add to first type, versatile dice will replace first die)";
      } else if (category === "activated") {
        labelText = "Activated Damage:";
      }
      return (
        <label className="col-flex" htmlFor="">
          <span>
            {labelText}{" "}
            <button
              id="addDamageType"
              name="addDamageType"
              onClick={() =>
                setCurrentItem((oldItem) => {
                  const newItem = { ...oldItem };
                  newItem.damage[category].push(
                    structuredClone(DAMAGE_TEMPLATE)
                  );
                  return newItem;
                })
              }
            >
              Add type
            </button>
          </span>
          {getDamageSelector(category)}
        </label>
      );
    };

    attackSection = currentItem.types.includes("Weapon") && (
      <>
        {editing ? (
          <label>
            Bonus Attack Modifier:{" "}
            <input
              id="attackMod"
              name="attackMod"
              type="number"
              min={0}
              value={currentItem.attackBonus}
              onChange={(event) => {
                setCurrentItem((oldItem) => {
                  const newItem = { ...oldItem };
                  newItem.attackBonus = parseInt(event.target.value);
                  return newItem;
                });
              }}
            ></input>
          </label>
        ) : (
          <p>
            Attack Modifier: {combineBreakdown(attackModBreakdown)}
            {` = ${attackMod}`}
          </p>
        )}

        {editing ? (
          getDamageSection("base")
        ) : (
          <p>
            Damage: {combineBreakdown(damageBreakdown)}
            {` = ${damage}`}
          </p>
        )}
      </>
    );

    twoHandedSection = typeof currentItem.toggles["Two-Handed"] ===
      "boolean" && (
      <span>
        <label htmlFor={"twoHanded"}>Two-Handed: </label>
        <button
          id={"twoHanded"}
          name={"twoHanded"}
          onClick={() => {
            setCurrentItem((oldItem) => {
              const newItem = { ...oldItem };
              newItem.toggles["Two-Handed"] = !newItem.toggles["Two-Handed"];
              return newItem;
            });
          }}
        >
          {currentItem.toggles["Two-Handed"] ? "Yes" : "No"}
        </button>
      </span>
    );

    activatedSection = (typeof currentItem.toggles.Activated === "boolean" ||
      editing) && (
      <>
        <span>
          {editing && (
            <>
              <label htmlFor={"activatable"}>Activatable: </label>
              <button
                id={"activatable"}
                name={"activatable"}
                onClick={() =>
                  setCurrentItem((oldItem) => {
                    const newItem = { ...oldItem };
                    if (typeof newItem.toggles.Activated === "boolean") {
                      newItem.toggles.Activated = undefined;
                      if (newItem.damage) newItem.damage.activated = undefined;
                    } else {
                      newItem.toggles.Activated = false;
                      if (newItem.damage) newItem.damage.activated = [];
                    }
                    return newItem;
                  })
                }
              >
                {typeof currentItem.toggles.Activated === "boolean"
                  ? "Yes"
                  : "No"}
              </button>{" "}
            </>
          )}
          {typeof currentItem.toggles.Activated === "boolean" && (
            <>
              <label htmlFor={"activated"}>Activated: </label>
              <button
                id={"activated"}
                name={"activated"}
                onClick={() =>
                  setCurrentItem((oldItem) => {
                    const newItem = { ...oldItem };
                    newItem.toggles.Activated = !newItem.toggles.Activated;
                    return newItem;
                  })
                }
              >
                {currentItem.toggles.Activated ? "Yes" : "No"}
              </button>
            </>
          )}
        </span>
        {editing &&
          typeof currentItem.toggles.Activated === "boolean" &&
          currentItem.types.includes("Weapon") && (
            <span>{getDamageSection("activated")}</span>
          )}
      </>
    );
  }

  const body = (
    <>
      {typeSection}
      {amountSection}
      {valueSection}
      {equippedSection}
      {attunedSection}
      {proficiencySection}
      {propertiesSection}
      {attackSection}
      {twoHandedSection}
      {activatedSection}
      {descriptionSection}
    </>
  );

  const footer = isNew ? (
    <>
      <button onClick={closeModal}>Cancel</button>
      <button onClick={saveAndClose}>Save</button>
    </>
  ) : null;

  return (
    <GenericModal
      closeModal={isNew ? () => {} : saveAndClose}
      header={header}
      body={body}
      footer={footer}
      category={"item"}
    />
  );
};

export default ItemModal;
