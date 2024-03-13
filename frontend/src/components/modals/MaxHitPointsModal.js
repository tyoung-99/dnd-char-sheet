// Modal to set max HP/view calculation breakdown

import { useState } from "react";
import GenericModal from "./GenericModal";
import "../../styling/components/modals/MaxHitPointsModal.css";

const MaxHitPointsModal = ({ character, closeModal, breakdown }) => {
  const [base, setBase] = useState(parseInt(breakdown));
  breakdown = breakdown.slice(parseInt(breakdown).toString().length);

  const header = <h1>Maximum Hit Points</h1>;

  const body = (
    <>
      <p>
        <input
          type="number"
          value={base}
          min={0}
          onChange={(event) => setBase(parseInt(event.target.value))}
          onBlur={() => character.setMaxHitPointsBase(base)}
        ></input>
        {breakdown}
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
