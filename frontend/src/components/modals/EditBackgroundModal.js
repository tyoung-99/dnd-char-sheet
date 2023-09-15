// Popup for editing 1 background
import "../../styling/EditDataModal.css";
import { useState } from "react";
import DynamicTextArea from "../DynamicTextArea";

const EditBackgroundModal = ({ item, closeModal, updateItem, removeItem }) => {
  const [newBackground, setNewBackground] = useState(item);

  const queueChange = (event) => {
    const backgroundChange = { ...newBackground };
    backgroundChange.name = event.target.value;
    setNewBackground(backgroundChange);
  };

  const confirmDelete = (event) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${newBackground.name} and all its contained data? This cannot be undone.`
      )
    ) {
      removeItem(newBackground);
      closeModal(newBackground.id);
    }
  };

  return (
    <div className="modal-background">
      <div className="modal-container">
        <div className="header">
          <input
            name="background-name"
            onChange={queueChange}
            placeholder="Background Name"
            value={newBackground.name}
          ></input>
        </div>
        <div className="body col-flex">
          <div className="row-flex col-12">
            <label htmlFor="background-src" className="col-3">
              Source
            </label>
            <input
              name="background-src"
              onChange={queueChange}
              value={newBackground.source}
            ></input>
          </div>
          <div className="row-flex col-12">
            <label htmlFor="background-trait-1" className="col-3">
              Personality Trait
            </label>
            <DynamicTextArea
              name="background-trait-1"
              onChange={queueChange}
              value={newBackground.personalityTrait1}
              className="locked-textarea"
            />
          </div>
          <div className="row-flex col-12">
            <label htmlFor="background-trait-2" className="col-3">
              Personality Trait
            </label>
            <DynamicTextArea
              name="background-trait-2"
              onChange={queueChange}
              value={newBackground.personalityTrait2}
              className="locked-textarea"
            />
          </div>
          <div className="row-flex col-12">
            <label htmlFor="background-ideal" className="col-3">
              Ideal
            </label>
            <DynamicTextArea
              name="background-ideal"
              onChange={queueChange}
              value={newBackground.ideal}
              className="locked-textarea"
            />
          </div>
          <div className="row-flex col-12">
            <label htmlFor="background-bond" className="col-3">
              Bond
            </label>
            <DynamicTextArea
              name="background-bond"
              onChange={queueChange}
              value={newBackground.bond}
              className="locked-textarea"
            />
          </div>
          <div className="row-flex col-12">
            <label htmlFor="background-flaw" className="col-3">
              Flaw
            </label>
            <DynamicTextArea
              name="background-flaw"
              onChange={queueChange}
              value={newBackground.flaw}
              className="locked-textarea"
            />
          </div>
        </div>
        <div className="footer">
          <button
            onClick={() => {
              closeModal(newBackground.id);
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              updateItem(newBackground);
              closeModal(newBackground.id);
            }}
          >
            Save
          </button>
          <button
            name="delete-background"
            className="warn-button"
            onClick={confirmDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBackgroundModal;
