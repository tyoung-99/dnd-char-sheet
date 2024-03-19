// Modal to set max HP/view calculation breakdown

import { useState } from "react";
import GenericModal from "./GenericModal";
import "../../styling/components/modals/MaxHitPointsModal.css";

const MaxHitPointsModal = ({ character, closeModal, breakdown, total }) => {
  const [base, setBase] = useState(breakdown[0].val);
  const [runningTotal, setRunningTotal] = useState(total);
  breakdown = breakdown.slice(1);

  const header = <h1>Maximum Hit Points</h1>;

  const body = (
    <>
      <p>
        <input
          type="number"
          value={base}
          min={0}
          onChange={(event) => {
            const newBase = parseInt(event.target.value);
            const change = newBase - base;
            setBase(newBase);
            setRunningTotal(runningTotal + change);
          }}
          onBlur={() => character.setMaxHitPointsBase(base)}
        ></input>
        {breakdown.reduce((fullText, current, i) => {
          if (current.val >= 0) fullText += " + ";
          else fullText += " - ";
          fullText += `${Math.abs(current.val)} (${current.label})`;
          return fullText;
        }, "")}
        {` = ${runningTotal}`}
      </p>
      <ul>
        <li>
          For base value, enter total from hit dice only. Any modifiers will be
          added automatically.
        </li>
      </ul>
    </>
  );

  const footer = null;

  return (
    <GenericModal
      closeModal={closeModal}
      header={header}
      body={body}
      footer={footer}
      category={"max-hit-points"}
    />
  );
};

export default MaxHitPointsModal;
