// Modal to view/edit saving throw calculation

import { Fragment, useState } from "react";
import GenericModal from "./GenericModal";
import "../../styling/components/modals/SavingThrowsModal.css";

const SavingThrowsModal = ({ character, closeModal }) => {
  const [saves] = useState(character.getSaves());

  const saveAndClose = () => {
    // TODO: Add functionality for custom bonuses, potentially also add ability to change feature choice bonuses from this window
    // character.setSavingThrows(saves);
    closeModal();
  };

  const header = <h1>Saving Throws</h1>;

  const tableCols = (
    <colgroup>
      {saves[0].profBreakdown.map((entry, i) => (
        <col key={i}></col>
      ))}
      <col></col>
      {saves[0].bonusBreakdown.map((entry, i) => (
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
        {saves[0].profBreakdown.map((entry, i) => (
          <th key={i}>{entry.label}</th>
        ))}
        <th>Ability</th>
        {saves[0].bonusBreakdown.map((entry, i) => (
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
      {saves.map((save, i) => (
        <tr key={save.name}>
          {save.profBreakdown.map((entry, j) => (
            <td key={j}>
              {entry.saves.includes(save.name) ? (
                <span className="proficient" title="Proficient"></span>
              ) : (
                <span className="not-proficient" title="Unproficient"></span>
              )}
            </td>
          ))}
          <td>{save.name}</td>
          {save.bonusBreakdown.map((entry, j) => (
            <Fragment key={j}>
              {j === 0 ? (
                <td>
                  {entry.val >= 0 ? "+" : ""}
                  {entry.val}
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
          <td>{(save.mod >= 0 ? "+" : "") + save.mod}</td>
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
      category={"saving-throws"}
    />
  );
};

export default SavingThrowsModal;
