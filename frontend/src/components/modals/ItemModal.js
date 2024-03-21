// Modal to view/edit item details

import GenericModal from "./GenericModal";
import "../../styling/components/modals/ItemModal.css";

const ItemModal = ({ character, closeModal, item }) => {
  console.log(item);

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
      <p>Amount: {item.count}</p>
      <p>Equipped: {item.equipped ? "Yes" : "No"}</p>
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
      {typeof item.activated !== "boolean" ? null : (
        <p>Activated: {item.activated ? "Yes" : "No"}</p>
      )}
    </>
  );

  const footer = null;

  return (
    <GenericModal
      closeModal={closeModal}
      header={header}
      body={body}
      footer={footer}
      category={"item"}
    />
  );
};

export default ItemModal;
