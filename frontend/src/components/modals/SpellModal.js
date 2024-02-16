// Modal to view full details of a spell

import GenericModal from "./GenericModal";
import styling from "../../styling/components/modals/SpellModal.module.css";

const SpellModal = ({ spell, character, closeModal, isOpen }) => {
  const getNumSuffix = (number) => {
    if (number > 3 && number < 21) return "th";
    switch (number % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const header = (
    <>
      <h1>{spell.name}</h1>
      <p>
        <i>
          {spell.level > 0
            ? `${spell.level}${getNumSuffix(spell.level)}-Level `
            : ""}
          {spell.school}
          {spell.level === 0 ? " Cantrip" : ""}
          {spell.ritual ? " (Ritual)" : ""}
        </i>
      </p>
      <p>
        <b>Casting Time: </b>
        {spell.castTime}
      </p>
      <p>
        <b>Range: </b>
        {spell.range}
      </p>
      <p>
        <b>Components: </b>
        {character.getSpellComponents(spell)}
      </p>
      <p>
        <b>Duration: </b>
        {spell.duration}
      </p>
    </>
  );

  const body = (
    <>
      {spell.description.map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
    </>
  );

  let srcText;
  if (spell.class) srcText = ["Class", spell.class];
  else if (spell.race) srcText = ["Race", spell.race];
  else if (spell.background) srcText = ["Background", spell.background];
  else if (spell.feat) srcText = ["Feat", spell.feat];

  const footer = (
    <p>
      <b>Obtained From {srcText[0]}: </b>
      {srcText[1]}
    </p>
  );

  return (
    <GenericModal
      isOpen={isOpen}
      closeModal={closeModal}
      header={header}
      body={body}
      footer={footer}
      extraStyling={styling}
    />
  );
};

export default SpellModal;
