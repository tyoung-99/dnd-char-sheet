import React, { useState, useEffect } from "react";
import axios from "axios";
import EditRaceModal from "../modals/adminModals/EditRaceModal";
import EditSubraceModal from "../modals/adminModals/EditSubraceModal";

// takes list and returns JSX with delete and edit buttons on every name
const CatalogueListComp = ({
  itemList,
  handleDelete,
  selectedRace,
  setSelectedRace,
  currentModal,
  setcurrentModal,
  closeModal,
}) => {
  const [subraces, setSubraces] = useState({});

  useEffect(() => {
    const loadSubraces = async (raceId) => {
      const response = await axios.get(`/api/races/${raceId}/subraces`);
      setSubraces((prevState) => ({
        ...prevState,
        [raceId]: response.data,
      }));
    };

    itemList.forEach((item) => {
      if (!subraces[item._id]) {
        loadSubraces(item._id);
      }
    });
  }, [itemList, subraces]);

  const addSubrace = async (newData) => {
    const response = await axios.post(`/api/subraces/insert`, newData);
    setSubraces((prevState) => ({
      ...prevState,
      [newData.parentRace]: response.data,
    }));
  };

  const deleteSubRace = async (id, parentRace) => {
    const response = await axios.delete(
      `/api/subraces/${id}/delete/${parentRace}`
    );
    setSubraces((prevState) => ({
      ...prevState,
      [parentRace]: response.data,
    }));
  };

  return (
    <>
      {itemList.map((race, i) => (
        <div key={race.name} className="catalogue-item">
          <span onClick={() => setcurrentModal(race._id)}>{race.name}</span>
          <button
            onClick={() => {
              setSelectedRace((prevName) =>
                prevName === race.name ? "" : race.name
              );
            }}
          >
            expand
          </button>
          <button
            onClick={() => {
              const result = window.confirm(
                "This will delete the race and all subraces. Press OK to confirm deletion"
              );
              if (result) {
                handleDelete(race._id);
              }
            }}
          >
            Delete
          </button>
          {currentModal === race._id && (
            <EditRaceModal race={race} closeModal={closeModal} />
          )}
          {/* Render subrace if they exist*/}
          {subraces[race._id] && selectedRace === race.name && (
            <div className="sub-section">
              <button
                className="admin-create"
                onClick={() => setcurrentModal("createSubrace")}
              >
                +
              </button>
              {subraces[race._id].map((subrace, index) => (
                <div key={index} className="sub-item">
                  <span onClick={() => setcurrentModal(subrace._id)}>
                    {subrace.name}
                  </span>
                  <button
                    onClick={() => {
                      const result = window.confirm(
                        "This will permanently delete this rubrace"
                      );
                      if (result) {
                        deleteSubRace(subrace._id, race._id);
                      }
                    }}
                  >
                    Delete
                  </button>
                  {currentModal === subrace._id && (
                    <EditSubraceModal
                      race={subrace}
                      closeModal={closeModal}
                      parentRace={race._id}
                    />
                  )}
                </div>
              ))}
              {currentModal === "createSubrace" && (
                <EditSubraceModal
                  race={{}}
                  closeModal={closeModal}
                  parentRace={race._id}
                  addSubrace={addSubrace}
                />
              )}
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default CatalogueListComp;
