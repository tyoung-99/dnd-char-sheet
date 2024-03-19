// Reusable modal for generic feature calculation breakdowns

import GenericModal from "./GenericModal";
import "../../styling/components/modals/GenericBreakdownModal.css";

const GenericBreakdownModal = ({ title, closeModal, breakdown, total }) => {
  const header = <h1>{title}</h1>;

  console.log(breakdown);

  const body = (
    <p>
      {breakdown.reduce((fullText, current, i) => {
        if (i !== 0) {
          if (current.val < 0) fullText += " - ";
          else fullText += " + ";
        }

        if (current.val) {
          fullText += `${Math.abs(current.val)}`;
          if (current.die) fullText += " + ";
        }

        if (current.die) {
          fullText += `${current.die.number}d${current.die.sides}`;
        }

        fullText += ` (${current.label})`;
        return fullText;
      }, "")}
      {` = ${total}`}
    </p>
  );

  const footer = null;

  return (
    <GenericModal
      closeModal={closeModal}
      header={header}
      body={body}
      footer={footer}
      category={"generic-breakdown"}
    />
  );
};

export default GenericBreakdownModal;
