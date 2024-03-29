// Modal for displaying a category of example background characteristics

import GenericModal from "./GenericModal";

const BackgroundCharacteristicModal = ({
  title,
  characteristicList,
  closeModal,
}) => {
  const header = <h1>{title}</h1>;

  const body = (
    <ol>
      {characteristicList.map((characteristic, i) => (
        <li key={i}>{characteristic}</li>
      ))}
    </ol>
  );

  const footer = null;

  return (
    <GenericModal
      closeModal={closeModal}
      header={header}
      body={body}
      footer={footer}
      category={"background-characteristic"}
    />
  );
};

export default BackgroundCharacteristicModal;
