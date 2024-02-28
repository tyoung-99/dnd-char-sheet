import GenericModal from "./GenericModal";

const EditRaceModal = ({ race, closeModal, isOpen }) => {
  const header = null;
  const footer = null;
  const body = race;

  return (
    <GenericModal
      header={header}
      body={body}
      footer={footer}
      category={"raceAdmin"}
    />
  );
};

export default EditRaceModal;
