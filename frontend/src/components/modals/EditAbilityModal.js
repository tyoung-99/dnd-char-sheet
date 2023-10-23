// Popup for editing 1 ability
import "../../styling/EditDataModal.css";
import { useState } from "react";

const EditAbilityModal = ({ item, closeModal, updateItem, removeItem }) => {
  const [newAbility, setNewAbility] = useState(item);

  const queueChange = (event) => {
    const inputField = event.target;

    const abilityChange = structuredClone(newAbility);

    switch (inputField.name) {
      case "ability-name":
        abilityChange.name = inputField.value;
        break;
      case "ability-abbrev":
        abilityChange.abbreviation = inputField.value;
        break;
      default:
        window.alert(`Unexpected input field name: ${inputField.name}`);
    }

    setNewAbility(abilityChange);
  };

  const confirmDelete = (event) => {
    if (
      window.confirm(
        `Are you sure you want to delete this item and all its contained data? This cannot be undone.`
      )
    ) {
      removeItem(newAbility);
      closeModal(newAbility.id);
    }
  };

  return (
    <div className="modal-background">
      <div className="modal-container">
        <div className="header">
          <input
            type="text"
            name="ability-name"
            onChange={queueChange}
            placeholder="Ability Name"
            value={newAbility.name}
          ></input>
        </div>
        <div className="body">
          <div className="row-flex col-12">
            <label htmlFor="ability-abbrev">Abbreviation</label>
            <input
              type="text"
              className="labeled-text"
              id="ability-abbrev"
              name="ability-abbrev"
              onChange={queueChange}
              value={newAbility.abbreviation}
            ></input>
          </div>
        </div>
        <div className="footer">
          <button
            onClick={() => {
              closeModal(newAbility.id);
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              updateItem(newAbility);
              closeModal(newAbility.id);
            }}
          >
            Save
          </button>
          <button
            name="delete-ability"
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

export default EditAbilityModal;
