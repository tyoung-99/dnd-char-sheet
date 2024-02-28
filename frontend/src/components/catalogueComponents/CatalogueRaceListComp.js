import React, { useState, useEffect } from "react";
import axios from "axios";
import EditRaceModal from "../modals/EditRaceModal";
// takes list and returns JSX with delete and edit buttons on every name
const CatalogueListComp = ({
  itemList,
  handleDelete,
  subDelete,
  selectedRace,
  setSelectedRace,
  selectedModal,
  setSelectedModal,
}) => {
  const [subraces, setSubraces] = useState({});

  useEffect(() => {
    const loadSubraces = async (raceId) => {
      const response = await axios.get(`/api/subraces/${raceId}`);
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

  return (
    <>
      {itemList.map((item, i) => (
        <div key={item.name} className="catalogue-item">
          <span onClick={() => setSelectedModal(item._id)}>{item.name}</span>
          <button onClick={() => setSelectedRace(item.name)}>expand</button>
          <button onClick={() => handleDelete(item._id)}>Delete</button>
          {selectedModal === item._id && <EditRaceModal race={item.name} />}
          {/* Render subrace if they exist*/}
          {subraces[item._id] && selectedRace === item.name && (
            <div className="sub-section">
              {subraces[item._id].map((subrace, index) => (
                <div key={index} className="sub-item">
                  <span>{subrace.name}</span>
                  <button onClick={() => subDelete(subraces._id)}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default CatalogueListComp;
