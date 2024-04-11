// Modal to spend hit dice

import { useState } from "react";
import GenericModal from "./GenericModal";
import "../../styling/components/modals/CurrentHitDiceModal.css";

const CurrentHitDiceModal = ({ character, closeModal }) => {
  const sortDice = (unsorted) =>
    unsorted.sort((first, second) => second.sides - first.sides);
  const [currentDice, setCurrentDice] = useState(
    sortDice(character.getCurrentHitDice())
  );
  let [totalDice] = character.getTotalHitDice();
  totalDice = sortDice(totalDice);

  const header = <h1>Current Hit Dice</h1>;

  const body = (
    <>
      {currentDice.map((dice, i) => (
        <div key={dice.sides} className="die-type">
          <span>
            {dice.number}d{dice.sides}
          </span>
          <span className="button-holder">
            <button
              className={
                `spend-dice ` +
                (currentDice[i].number >= totalDice[i].number ? "hidden" : "")
              }
              onClick={() => {
                const newDice = [...currentDice];
                newDice[i].number += 1;
                setCurrentDice(newDice);
                character.restoreHitDie(dice.sides);
              }}
            >
              Restore
            </button>
            <button
              className={
                `spend-dice ` + (currentDice[i].number <= 0 ? "hidden" : "")
              }
              onClick={() => {
                const newDice = [...currentDice];
                newDice[i].number -= 1;
                setCurrentDice(newDice);
                character.spendHitDie(dice.sides);
              }}
            >
              Use
            </button>
          </span>
        </div>
      ))}
    </>
  );

  const footer = null;

  return (
    <GenericModal
      closeModal={closeModal}
      header={header}
      body={body}
      footer={footer}
      category={"current-hit-dice"}
    />
  );
};

export default CurrentHitDiceModal;
