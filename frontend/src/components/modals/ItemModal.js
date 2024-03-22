// Modal to view/edit item details

import { useState, Fragment } from "react";
import GenericModal from "./GenericModal";
import "../../styling/components/modals/ItemModal.css";

const ItemModal = ({ character, closeModal, item }) => {
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

  const [itemCount, setItemCount] = useState(item.count);
  const [toggles, setToggles] = useState(structuredClone(item.toggles));

  const saveAndClose = () => {
    character.updateItem(item, itemCount, toggles);
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

  const header = <h1>{item.name}</h1>;

  let attackMod, attackModBreakdown, damage, damageBreakdown;
  if (item.type === "Weapon") {
    [[attackMod, attackModBreakdown], [damage, damageBreakdown]] =
      character.getAttack(item);
  }

  const body = (
    <>
      <p>
        Type: {item.type}
        {item.subtypes ? ` (${item.subtypes.join(", ")})` : ""}
      </p>
      <span>
        <label htmlFor="itemCount">Amount: </label>
        <input
          type="number"
          id="itemCount"
          name="itemCount"
          value={itemCount}
          min={0}
          onChange={(e) => setItemCount(e.target.value)}
        ></input>
      </span>
      {typeof toggles.Equipped === "boolean" && (
        <span>
          <label htmlFor={"equipped"}>Equipped: </label>
          <button
            id={"equipped"}
            name={"equipped"}
            onClick={() =>
              setToggles((oldToggles) => {
                const newToggles = { ...oldToggles };
                newToggles.Equipped = !newToggles.Equipped;
                return newToggles;
              })
            }
          >
            {toggles.Equipped ? "Yes" : "No"}
          </button>
        </span>
      )}
      {typeof toggles.Attuned === "boolean" && (
        <span>
          <label htmlFor={"attuned"}>Attuned: </label>
          <button
            id={"attuned"}
            name={"attuned"}
            onClick={() =>
              setToggles((oldToggles) => {
                const newToggles = { ...oldToggles };
                newToggles.Attuned = !newToggles.Attuned;
                return newToggles;
              })
            }
          >
            {toggles.Attuned ? "Yes" : "No"}
          </button>
        </span>
      )}
      {!item.profRequired ? null : (
        <p>Requires proficiency in one of: {item.profRequired.join(", ")}</p>
      )}
      {!item.properties ? null : (
        <p>
          Properties:{" "}
          {item.properties.map((property, i) => (
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
      {!(item.type === "Weapon") ? null : (
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
      {typeof toggles["Two-Handed"] === "boolean" && (
        <span>
          <label htmlFor={"twoHanded"}>Two-Handed: </label>
          <button
            id={"twoHanded"}
            name={"twoHanded"}
            onClick={() => {
              character.toggleItemTwoHanded(item);
              setToggles((oldToggles) => {
                const newToggles = { ...oldToggles };
                newToggles["Two-Handed"] = !newToggles["Two-Handed"];
                return newToggles;
              });
            }}
          >
            {toggles["Two-Handed"] ? "Yes" : "No"}
          </button>
        </span>
      )}
      {typeof toggles.Activated === "boolean" && (
        <span>
          <label htmlFor={"activated"}>Activated: </label>
          <button
            id={"activated"}
            name={"activated"}
            onClick={() => {
              character.toggleItemActive(item);
              setToggles((oldToggles) => {
                const newToggles = { ...oldToggles };
                newToggles.Activated = !newToggles.Activated;
                return newToggles;
              });
            }}
          >
            {toggles.Activated ? "Yes" : "No"}
          </button>
        </span>
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
