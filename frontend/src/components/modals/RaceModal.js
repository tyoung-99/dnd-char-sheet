// Modal to view current race/features and change either race or available feature choices

import GenericModal from "./GenericModal";
import "../../styling/components/modals/RaceModal.css";

const RaceModal = ({ character, closeModal, isOpen }) => {
  const header = <h1>Race</h1>;

  const body = <p>Test</p>;

  const footer = <></>;

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
