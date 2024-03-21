// Modal to view/edit item details

import { useState } from "react";
import GenericModal from "./GenericModal";
import "../../styling/components/modals/ItemModal.css";

const ItemModal = ({ character, closeModal, item }) => {
  console.log(item);

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
        <p>Properties: {item.properties.join(", ")}</p>
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
      {typeof toggles["Two Handed"] === "boolean" && (
        <span>
          <label htmlFor={"twoHanded"}>Two Handed: </label>
          <button
            id={"twoHanded"}
            name={"twoHanded"}
            onClick={() => {
              character.toggleItemTwoHanded(item);
              setToggles((oldToggles) => {
                const newToggles = { ...oldToggles };
                newToggles["Two Handed"] = !newToggles["Two Handed"];
                return newToggles;
              });
            }}
          >
            {toggles["Two Handed"] ? "Yes" : "No"}
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
