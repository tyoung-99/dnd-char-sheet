// Modal to view current race/features and change either race or available feature choices

import GenericModal from "./GenericModal";
import "../../styling/components/modals/RaceModal.css";

const RaceModal = ({ character, closeModal, isOpen }) => {
  const header = null;

  const raceFeatures = (
    <>
      {character.getFeatures({ fromRace: true }).map((feature, i) => (
        <div key={i}>
          <p
            className="feature-name"
            title={feature.desc.reduce(
              (fullText, paragraph) => (fullText += "\n" + paragraph),
              ""
            )}
          >
            {feature.name}
          </p>
        </div>
      ))}
    </>
  );
  const subraceFeatures = (
    <>
      {character.getFeatures({ fromSubrace: true }).map((feature, i) => (
        <div key={i}>
          <p
            className="feature-name"
            title={feature.desc.reduce(
              (fullText, paragraph) => (fullText += "\n" + paragraph),
              ""
            )}
          >
            {feature.name}
          </p>
        </div>
      ))}
    </>
  );

  const body = (
    <>
      <h1 className="category-name">Race: {character.race.name}</h1>
      {raceFeatures}
      <h1 className="category-name">
        Subrace: {character.race.subrace || "None"}
      </h1>
      {subraceFeatures}
    </>
  );

  const footer = null;

  return (
    <GenericModal
      isOpen={isOpen}
      closeModal={closeModal}
      header={header}
      body={body}
      footer={footer}
      category={"race"}
    />
  );
};

export default RaceModal;
