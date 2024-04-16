// Modal to view/edit item details

import { useState, Fragment } from "react";
import GenericModal from "./GenericModal";
import EditorConvertToJSON from "../EditorConvertToJSON";
import "../../styling/components/modals/ItemModal.css";

const ItemModal = ({ character, setCharChangeFlag, closeModal, item }) => {
  const PROPERTIES_DESCS = {
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

  const [editing, setEditing] = useState(false);
  const [newItem, setNewItem] = useState(structuredClone(item));

  const saveAndClose = () => {
    character.updateItem(item, newItem);
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
        entry.val.dice.forEach((die) => {
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
            value={newItem.name}
            onChange={(event) =>
              setNewItem((oldItem) => {
                const newItem = { ...oldItem };
                newItem.name = event.target.value;
                return newItem;
              })
            }
          ></input>
        ) : (
          newItem.name
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

  let attackMod, attackModBreakdown, damage, damageBreakdown;
  if (newItem.type === "Weapon") {
    [[attackMod, attackModBreakdown], [damage, damageBreakdown]] =
      character.getAttack(item);
  }

  const typeSelection = newItem.types.map((type, i) => (
    <span key={i}>
      <select
        name={`type${i}`}
        id={`type${i}`}
        value={type}
        onChange={(event) => {
          setNewItem((oldItem) => {
            const newItem = { ...oldItem };
            newItem.types[i] = event.target.value;
            newItem.subtypes[i] = ITEM_TYPES[event.target.value] ? [] : null;
            return newItem;
          });
        }}
      >
        <option hidden value={""}>
          Select type
        </option>
        {Object.keys(ITEM_TYPES).map((refType) => {
          if (newItem.types.includes(refType) && refType !== type) return null;
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
          {newItem.subtypes[i].map((subtype, j) => (
            <Fragment key={j}>
              {j > 0 && ", "}
              <span
                className="subtype"
                onClick={() =>
                  setNewItem((oldItem) => {
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
              setNewItem((oldItem) => {
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
              if (newItem.subtypes[i].includes(refSubtype)) return null;
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
          onClick={() =>
            setNewItem((oldItem) => {
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

  const body = (
    <>
      {editing ? (
        <>
          <label className="col-flex" htmlFor="">
            <span>
              Type: (First type determines sorting)
              <button
                className="add-type"
                id="addType"
                name="addType"
                onClick={() =>
                  setNewItem((oldItem) => {
                    const newItem = { ...oldItem };
                    oldItem.types.push("");
                    oldItem.subtypes.push([]);
                    return newItem;
                  })
                }
              >
                Add type
              </button>
            </span>
            {typeSelection}
          </label>
        </>
      ) : (
        <p>
          Type:{" "}
          {newItem.types.map(
            (type, i) =>
              `${i > 0 ? ", " : ""}${type}${
                newItem.subtypes[i]
                  ? ` (${newItem.subtypes[i].join(", ")})`
                  : ""
              }`
          )}
        </p>
      )}
      <span>
        <label htmlFor="itemCount">Amount: </label>
        <input
          type="number"
          id="itemCount"
          name="itemCount"
          value={newItem.count}
          min={0}
          onChange={(e) =>
            setNewItem((oldItem) => {
              const newItem = { ...oldItem };
              newItem.count = e.target.value;
              return newItem;
            })
          }
        ></input>
      </span>
      {typeof newItem.toggles.Equipped === "boolean" && (
        <span>
          <label htmlFor={"equipped"}>Equipped: </label>
          <button
            id={"equipped"}
            name={"equipped"}
            onClick={() =>
              setNewItem((oldItem) => {
                const newItem = { ...oldItem };
                newItem.toggles.Equipped = !newItem.toggles.Equipped;
                return newItem;
              })
            }
          >
            {newItem.toggles.Equipped ? "Yes" : "No"}
          </button>
        </span>
      )}
      {typeof newItem.toggles.Attuned === "boolean" && (
        <span>
          <label htmlFor={"attuned"}>Attuned: </label>
          <button
            id={"attuned"}
            name={"attuned"}
            onClick={() =>
              setNewItem((oldItem) => {
                const newItem = { ...oldItem };
                newItem.toggles.Attuned = !newItem.toggles.Attuned;
                return newItem;
              })
            }
          >
            {newItem.toggles.Attuned ? "Yes" : "No"}
          </button>
        </span>
      )}
      {!newItem.profRequired ? null : (
        <p>Requires proficiency in one of: {newItem.profRequired.join(", ")}</p>
      )}
      {!newItem.properties ? null : (
        <p>
          Properties:{" "}
          {newItem.properties.map((property, i) => (
            <Fragment key={i}>
              {i !== 0 ? ", " : ""}
              <span
                title={
                  property.includes("Versatile")
                    ? PROPERTIES_DESCS["Versatile"]
                    : PROPERTIES_DESCS[property]
                }
              >
                {property}
              </span>
            </Fragment>
          ))}
        </p>
      )}
      {!(newItem.type === "Weapon") ? null : (
        <>
          <p>
            Attack Modifier: {combineBreakdown(attackModBreakdown)}
            {` = ${attackMod}`}
          </p>
          <p>
            Damage: {combineBreakdown(damageBreakdown)}
            {` = ${damage}`}
          </p>
        </>
      )}
      {typeof newItem.toggles["Two-Handed"] === "boolean" && (
        <span>
          <label htmlFor={"twoHanded"}>Two-Handed: </label>
          <button
            id={"twoHanded"}
            name={"twoHanded"}
            onClick={() => {
              character.toggleItemTwoHanded(item);
              setNewItem((oldItem) => {
                const newItem = { ...oldItem };
                newItem.toggles["Two-Handed"] = !newItem.toggles["Two-Handed"];
                return newItem;
              });
            }}
          >
            {newItem.toggles["Two-Handed"] ? "Yes" : "No"}
          </button>
        </span>
      )}
      {typeof newItem.toggles.Activated === "boolean" && (
        <span>
          <label htmlFor={"activated"}>Activated: </label>
          <button
            id={"activated"}
            name={"activated"}
            onClick={() => {
              character.toggleItemActive(item);
              setNewItem((oldItem) => {
                const newItem = { ...oldItem };
                newItem.toggles.Activated = !newItem.toggles.Activated;
                return newItem;
              });
            }}
          >
            {newItem.toggles.Activated ? "Yes" : "No"}
          </button>
        </span>
      )}
      <p>Additional information:</p>
      {isJsonEditorEmpty(newItem.description) && !editing ? (
        <p>-None-</p>
      ) : (
        <EditorConvertToJSON
          readOnly={!editing}
          toolbarHidden={!editing}
          wrapperClassName={editing && "wysiwyg-textbox-wrapper"}
          editorClassName="wysiwyg-textbox-editor"
          onBlur={(contentJSON) =>
            setNewItem((oldItem) => {
              const newItem = { ...oldItem };
              newItem.description = contentJSON;
              return newItem;
            })
          }
          defaultTextJSON={newItem.description}
        />
      )}
    </>
  );

  const footer = null;

  return (
    <GenericModal
      closeModal={saveAndClose}
      header={header}
      body={body}
      footer={footer}
      category={"item"}
    />
  );
};

export default ItemModal;
