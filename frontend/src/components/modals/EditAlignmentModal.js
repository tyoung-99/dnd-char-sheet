// Popup for editing 1 alignment
import "../../styling/EditDataModal.css";
import { useState } from "react";

const EditAlignmentModal = ({ item, closeModal, updateItem, removeItem }) => {
  const [newAlignment, setNewAlignment] = useState(item);

  const queueChange = (event) => {
    const alignmentChange = { ...newAlignment };
    alignmentChange.name = event.target.value;
    setNewAlignment(alignmentChange);
  };

  const confirmDelete = (event) => {
    if (
      window.confirm(
        `Are you sure you want to delete this item and all its contained data? This cannot be undone.`
      )
    ) {
      removeItem(newAlignment);
      closeModal(newAlignment.id);
    }
  };

  return (
    <div className="modal-background">
      <div className="modal-container">
        <div className="header">
          <input
            type="text"
            name="alignment-name"
            onChange={queueChange}
            placeholder="Alignment Name"
            value={newAlignment.name}
          ></input>
        </div>
        <div className="body"></div>
        <div className="footer">
          <button
            onClick={() => {
              closeModal(newAlignment.id);
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              updateItem(newAlignment);
              closeModal(newAlignment.id);
            }}
          >
            Save
          </button>
          <button
            name="delete-alignment"
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

export default EditAlignmentModal;
