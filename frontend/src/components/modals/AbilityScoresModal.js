// Modal to view/edit ability score calculation

import { Fragment, useState } from "react";
import GenericModal from "./GenericModal";
import "../../styling/components/modals/AbilityScoresModal.css";

const AbilityScoresModal = ({ character, closeModal }) => {
  const [abilities, setAbilities] = useState(character.getAbilities());
  const POINT_COSTS = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };

  const saveAndClose = () => {
    character.setAbilityScores(abilities);
    closeModal();
  };

  const header = <h1>Ability Scores</h1>;

  abilities.forEach((ability) => {
    ability.breakdown.forEach((entry, i) => {
      if (i === 0) {
        if (character.abilities.pointBuy) {
          entry.min = 8;
          entry.max = 15;
        } else {
          entry.min = 0;
          entry.max = 30;
        }
      } else {
        // TODO: Set up inputs for feats, ASIs, etc. to allow editing them too
      }
    });
  });

  const tableCols = (
    <colgroup>
      <col></col>
      {abilities[0].breakdown.map((entry, i) => (
        <Fragment key={i}>
          {i === 0 ? (
            <col></col>
          ) : (
            <>
              <col></col>
              <col></col>
            </>
          )}
        </Fragment>
      ))}
      <col></col>
      <col></col>
      <col></col>
    </colgroup>
  );

  const tableHead = (
    <thead>
      <tr>
        <th>Ability</th>
        {abilities[0].breakdown.map((entry, i) => (
          <Fragment key={i}>
            {i === 0 ? (
              <th>Score</th>
            ) : (
              <>
                <th></th>
                <th title={entry.obtainedFrom && `From: ${entry.obtainedFrom}`}>
                  {entry.label}
                </th>
              </>
            )}
          </Fragment>
        ))}
        <th></th>
        <th>Total</th>
        <th>Modifier</th>
      </tr>
    </thead>
  );

  const tableBody = (
    <tbody>
      {abilities.map((ability, i) => (
        <tr key={ability.name}>
          <td>{ability.name}</td>
          {ability.breakdown.map((entry, j) => (
            <Fragment key={j}>
              {j === 0 ? (
                <td>
                  <input
                    type="number"
                    value={entry.val}
                    min={entry.min}
                    max={entry.max}
                    onChange={(event) =>
                      setAbilities((oldAbilities) => {
                        const newAbilities = [...oldAbilities];
                        const change =
                          parseInt(event.target.value) -
                          newAbilities[i].breakdown[j].val;
                        newAbilities[i].breakdown[j].val += change;
                        newAbilities[i].score += change;
                        newAbilities[i].mod = Math.floor(
                          (newAbilities[i].score - 10) / 2
                        );
                        return newAbilities;
                      })
                    }
                  ></input>
                </td>
              ) : (
                <>
                  <td>{entry.val >= 0 ? "+" : "-"}</td>
                  <td>{Math.abs(entry.val)}</td>
                </>
              )}
            </Fragment>
          ))}
          <td>=</td>
          <td>{ability.score}</td>
          <td>{(ability.mod >= 0 ? "+" : "") + ability.mod}</td>
        </tr>
      ))}
    </tbody>
  );

  const pointsSpent = abilities.reduce(
    (total, ability) => total + POINT_COSTS[ability.breakdown[0].val],
    0
  );
  const outOfBounds = (
    <img
      src={process.env.PUBLIC_URL + "/icons/danger.png"}
      alt="Score out of bounds"
      className="hover-icon"
      title="Base ability scores may only be from 8 to 15"
    ></img>
  );

  const pointBuyOptions = (
    <div className="point-buy-options">
      <button
        className={character.abilities.pointBuy ? "" : "selected"}
        id="manual-entry"
        name="manual-entry"
        onClick={() => {
          character.setPointBuy(false);
        }}
      >
        Manual Entry
      </button>
      <button
        className={character.abilities.pointBuy ? "selected" : ""}
        id="point-buy"
        name="point-buy"
        onClick={() => {
          character.setPointBuy(true);
        }}
      >
        Point Buy
      </button>
      <p className={character.abilities.pointBuy ? "" : "hidden"}>
        Total Points: {isNaN(pointsSpent) ? outOfBounds : `${pointsSpent}/27`}
      </p>
    </div>
  );

  const body = (
    <>
      <table className="abilities-table">
        {tableCols}
        {tableHead}
        {tableBody}
      </table>
      {pointBuyOptions}
    </>
  );

  const footer = null;

  return (
    <GenericModal
      closeModal={saveAndClose}
      header={header}
      body={body}
      footer={footer}
      category={"ability-scores"}
    />
  );
};

export default AbilityScoresModal;
