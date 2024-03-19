// Modal to view/edit speed calculation

import GenericModal from "./GenericModal";
import "../../styling/components/modals/SpeedModal.css";

const SpeedModal = ({ closeModal, breakdown, total }) => {
  const header = <h1>Speed</h1>;

  const formatBreakdown = (speedType) => {
    const formattedModifiers = breakdown.modifiers[speedType].map((mod, i) => (
      <span key={i} title={mod.obtainedFrom && `From: ${mod.obtainedFrom}`}>
        {i === 0
          ? mod.val
          : `${mod.val >= 0 ? " + " : " - "} ${Math.abs(mod.val)}`}{" "}
        ({mod.label})
      </span>
    ));

    const formattedMultipliers = breakdown.multipliers[speedType].map(
      (mult, i) => (
        <span key={i} title={mult.obtainedFrom && `From: ${mult.obtainedFrom}`}>
          {` * ${mult.val} (${mult.label})`}
        </span>
      )
    );

    return (
      <p>
        {/* Separated brackets necessary to make spans display properly */}
        {formattedModifiers.length > 0 ? "[" : ""}
        {formattedModifiers.length > 0
          ? formattedModifiers
          : "0 (No Base Speed)"}
        {formattedModifiers.length > 0 ? "]" : ""}
        {formattedMultipliers}
        {` = ${total[speedType]} feet`}
      </p>
    );
  };

  const body = (
    <>
      <h2>Walk</h2>
      {formatBreakdown("walk")}
      <h2>Swim</h2>
      {formatBreakdown("swim")}
      <h2>Fly</h2>
      {formatBreakdown("fly")}
    </>
  );

  const footer = null;

  return (
    <GenericModal
      closeModal={closeModal}
      header={header}
      body={body}
      footer={footer}
      category={"speed"}
    />
  );
};

export default SpeedModal;
