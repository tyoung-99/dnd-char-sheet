// Modal to view/edit saving throw calculation

import { Fragment, useState } from "react";
import GenericModal from "./GenericModal";
import "../../styling/components/modals/SkillsSavingThrowsModal.css";

const SkillsSavingThrowsModal = ({ character, closeModal, isSkills }) => {
  const [data] = useState(
    isSkills ? character.getSkills() : character.getSaves()
  );

  const saveAndClose = () => {
    // TODO: Add functionality for custom bonuses, potentially also add ability to change feature choice bonuses from this window
    closeModal();
  };

  const header = <h1>Saving Throws</h1>;

  const tableCols = (
    <colgroup>
      {data[0].profBreakdown.map((_, i) => (
        <col key={i}></col>
      ))}
      {isSkills ? <col></col> : null}
      <col></col>
      {data[0].bonusBreakdown.map((_, i) => (
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
    </colgroup>
  );

  const tableHead = (
    <thead>
      <tr>
        {data[0].profBreakdown.map((entry, i) => (
          <th
            key={i}
            title={entry.obtainedFrom && `From: ${entry.obtainedFrom}`}
          >
            {entry.label}
          </th>
        ))}
        {isSkills ? <th>Skill</th> : null}
        <th>Ability</th>
        {data[0].bonusBreakdown.map((entry, i) => (
          <Fragment key={i}>
            {i === 0 ? (
              <th>Ability Modifier</th>
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
        <th>Total Modifier</th>
      </tr>
    </thead>
  );

  const tableBody = (
    <tbody>
      {data.map((skillOrSave, i) => (
        <tr key={skillOrSave.name}>
          {skillOrSave.profBreakdown.map((profEntry, j) => (
            <td key={j}>
              {profEntry.prof === 0 ? (
                <span className="not-proficient" title="Unproficient"></span>
              ) : profEntry.prof === 1 ? (
                <span className="proficient" title="Proficient"></span>
              ) : (
                <span className="expert" title="Expert"></span>
              )}
            </td>
          ))}
          <td>{skillOrSave.name}</td>
          {isSkills ? <td>{skillOrSave.ability}</td> : null}
          {skillOrSave.bonusBreakdown.map((bonusEntry, j) => (
            <Fragment key={j}>
              {j === 0 ? (
                <td>
                  {bonusEntry.val.flat >= 0 ? "+" : ""}
                  {bonusEntry.val.flat}
                  {bonusEntry.val.dice.map(
                    (die) => ` + ${die.number}d${die.sides}`
                  )}
                </td>
              ) : (
                <>
                  <td>{bonusEntry.val.flat >= 0 ? "+" : "-"}</td>
                  <td>
                    {Math.abs(bonusEntry.val.flat)}
                    {bonusEntry.val.dice.map(
                      (die) => ` + ${die.number}d${die.sides}`
                    )}
                  </td>
                </>
              )}
            </Fragment>
          ))}
          <td>=</td>
          <td>
            {(skillOrSave.mod.flat >= 0 ? "+" : "") + skillOrSave.mod.flat}
            {skillOrSave.mod.dice.map((die) => ` + ${die.number}d${die.sides}`)}
          </td>
        </tr>
      ))}
    </tbody>
  );

  const body = (
    <>
      <table className="abilities-table">
        {tableCols}
        {tableHead}
        {tableBody}
      </table>
    </>
  );

  const footer = null;

  return (
    <GenericModal
      closeModal={saveAndClose}
      header={header}
      body={body}
      footer={footer}
      category={"skills-saving-throws"}
    />
  );
};

export default SkillsSavingThrowsModal;
