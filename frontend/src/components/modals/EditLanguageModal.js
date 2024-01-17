// Popup for editing 1 overall language
import "../../styling/EditDataModal.css";
import axios from "axios";
import { useState, useEffect } from "react";

const EditLanguageModal = ({ item, closeModal, updateItem, removeItem }) => {
  const [newLanguage, setNewLanguage] = useState(item);

  const queueChange = (event) => {
    const inputField = event.target;

    const languageChange = structuredClone(newLanguage);

    switch (inputField.name) {
      case "language-name":
        languageChange.name = inputField.value;
        break;
      case "language-speakers":
        languageChange.typicalSpeakers = inputField.value;
        break;
      case "language-script":
        languageChange.script = inputField.value;
        break;
      case "language-prevalence":
        languageChange.prevalence = inputField.value;
        break;
      default:
        window.alert(`Unexpected input field name: ${inputField.name}`);
    }

    setNewLanguage(languageChange);
  };

  const confirmDelete = (event) => {
    if (
      window.confirm(
        `Are you sure you want to delete this item and all its contained data? This cannot be undone.`
      )
    ) {
      removeItem(newLanguage);
      closeModal(newLanguage.id);
    }
  };

  return (
    <div className="modal-background">
      <div className="modal-container">
        <div className="header">
          <input
            type="text"
            className="labeled-text"
            name="language-name"
            onChange={queueChange}
            placeholder="Language Name"
            value={newLanguage.name}
          ></input>
        </div>
        <div className="body">
          <div className="row-flex col-12">
            <label htmlFor="language-speakers">Abbreviation</label>
            <input
              type="text"
              className="labeled-text"
              id="language-speakers"
              name="language-speakers"
              onChange={queueChange}
              value={newLanguage.typicalSpeakers}
            ></input>
          </div>
        </div>
        <div className="footer">
          <button
            onClick={() => {
              closeModal(newLanguage.id);
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              updateItem(newLanguage);
              closeModal(newLanguage.id);
            }}
          >
            Save
          </button>
          <button
            name="delete-language"
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

export default EditLanguageModal;
