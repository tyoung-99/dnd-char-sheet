import GenericModal from "../GenericModal";
import axios from "axios";
import { useEffect, useState } from "react";

const EditRaceFeatureModal = ({ closeModal }) => {
  const header = null;
  const body = null;
  const footer = (
    <>
      <button onClick={closeModal}>Cancel</button>
      <button
        onClick={() => {
          // save function;
          closeModal();
        }}
      >
        Save
      </button>
    </>
  );
  return (
    <GenericModal
      header={header}
      body={body}
      footer={footer}
      category={"raceFeatureAdmin"}
    />
  );
};

export default EditRaceFeatureModal;
