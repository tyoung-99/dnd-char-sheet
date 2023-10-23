// Popup for editing 1 overall skill
import "../../styling/EditDataModal.css";
import axios from "axios";
import { useState, useEffect } from "react";

const EditSkillModal = ({ item, closeModal, updateItem, removeItem }) => {
  const [newSkill, setNewSkill] = useState(item);
  const [abilitiesList, setAbilitiesList] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const newAbilitiesList = (await axios.get(`/api/data/abilities`)).data;
      newAbilitiesList.sort((first, second) => {
        if (first.name < second.name) {
          return -1;
        }
        if (first.name > second.name) {
          return 1;
        }
        return 0;
      });
      setAbilitiesList(newAbilitiesList);
    };
    loadData();
  }, []);

  const queueChange = (event) => {
    const inputField = event.target;

    const skillChange = structuredClone(newSkill);

    switch (inputField.name) {
      case "skill-name":
        skillChange.name = inputField.value;
        break;
      case "skill-ability":
        skillChange.ability = parseInt(inputField.value);
        break;
      default:
        window.alert(`Unexpected input field name: ${inputField.name}`);
    }

    setNewSkill(skillChange);
  };

  const confirmDelete = (event) => {
    if (
      window.confirm(
        `Are you sure you want to delete this item and all its contained data? This cannot be undone.`
      )
    ) {
      removeItem(newSkill);
      closeModal(newSkill.id);
    }
  };

  return (
    <div className="modal-background">
      <div className="modal-container">
        <div className="header">
          <input
            type="text"
            name="skill-name"
            onChange={queueChange}
            placeholder="Skill Name"
            value={newSkill.name}
          ></input>
        </div>
        <div className="body col-flex">
          {!abilitiesList ? null : (
            <select
              name="skill-ability"
              defaultValue={newSkill.ability}
              onChange={queueChange}
            >
              <option hidden>Select associated ability</option>
              {abilitiesList.map((ability) => (
                <option key={ability.id} value={ability.id}>
                  {ability.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="footer">
          <button
            onClick={() => {
              closeModal(newSkill.id);
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              updateItem(newSkill);
              closeModal(newSkill.id);
            }}
          >
            Save
          </button>
          <button
            name="delete-skill"
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

export default EditSkillModal;
