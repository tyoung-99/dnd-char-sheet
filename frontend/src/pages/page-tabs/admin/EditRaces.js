// Lists/allows editing of all possible races/associated abilities
import axios from "axios";
import { useState, useEffect } from "react";
import EditRaceModal from "../../../components/modals/EditRaceModal";

const EditRaces = () => {
  const [races, setRaces] = useState();
  const [openModals, setOpenModalsAll] = useState();

  useEffect(() => {
    const loadData = async () => {
      const newRaces = (await axios.get("/api/data/races")).data;
      newRaces.sort(sortRaces);
      setRaces(newRaces);

      let defaultOpenModals = [];
      newRaces.forEach((race) => {
        defaultOpenModals[race.id] = false;
      });
      setOpenModalsAll(defaultOpenModals);
    };
    loadData();
  }, []);

  const sortRaces = (first, second) => {
    if (first.name < second.name) {
      return -1;
    }
    if (first.name > second.name) {
      return 1;
    }
    return 0;
  };

  const setOpenModalOne = (event) => {
    const raceID = event.target.id;
    const newOpenModals = { ...openModals };
    newOpenModals[raceID] = true;
    setOpenModalsAll(newOpenModals);
  };

  const closeModal = (openRaceID) => {
    const newOpenModals = { ...openModals };
    newOpenModals[openRaceID] = false;
    setOpenModalsAll(newOpenModals);
  };

  const updateRace = async (newRace) => {
    const response = await axios.put(`/api/data/races/update`, {
      newData: newRace,
    });

    const newRaces = response.data;
    newRaces.sort(sortRaces);
    setRaces(newRaces);
  };

  const addRace = async () => {
    const newRaces = [...races];

    const response = await axios.put(`/api/data/races/add`, {
      newData: {
        name: "New Race",
        sources: [
          {
            name: "New Source",
            traits: [],
            subraces: [],
          },
        ],
      },
    });

    newRaces.push(response.data);
    newRaces.sort(sortRaces);
    setRaces(newRaces);
  };

  const removeRace = async (remove) => {
    const response = await axios.put(`/api/data/races/remove`, {
      newData: remove,
    });

    const newRaces = response.data;
    newRaces.sort(sortRaces);
    setRaces(newRaces);
  };

  if (!races) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button onClick={addRace}>Add Race</button>
      {races.map((race) => (
        <div key={race.id}>
          <h2 className="edit-link" id={race.id} onClick={setOpenModalOne}>
            {race.name !== "" ? race.name : "Unnamed Race"}
          </h2>
          {openModals[race.id] && (
            <EditRaceModal
              race={race}
              closeModal={closeModal}
              updateRace={updateRace}
              removeRace={removeRace}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default EditRaces;
