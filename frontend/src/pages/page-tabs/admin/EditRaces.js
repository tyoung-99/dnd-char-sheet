// Lists/allows editing of all possible races/associated abilities
import axios from "axios";
import { useState, useEffect } from "react";
import EditRaceModal from "../../../components/EditRaceModal";

const Races = () => {
  const [races, setRaces] = useState();
  const [openModals, setOpenModalsAll] = useState();

  useEffect(() => {
    const loadData = async () => {
      const newRaces = (await axios.get("/api/data/races")).data;
      setRaces(newRaces);

      let defaultOpenModals = [];
      newRaces.forEach((race) => {
        defaultOpenModals[race.id] = false;
      });
      setOpenModalsAll(defaultOpenModals);
    };
    loadData();
  }, []);

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
    const newRaces = [...races];
    const replaceIndex = newRaces.findIndex(
      (element) => element.id === newRace.id
    );
    newRaces[replaceIndex] = newRace;
    setRaces(newRaces);
    await axios.put(`/api/data/races/update`, {
      newData: newRaces,
    });
  };

  const addRace = async () => {
    const newRaces = [...races];
    newRaces.push({
      id: newRaces[newRaces.length - 1].id + 1,
      name: "New Race",
      sources: [
        {
          name: "New Source",
          traits: [],
          subraces: [],
        },
      ],
    });
    console.log(newRaces);
    setRaces(newRaces);
    await axios.put(`/api/data/races/update`, {
      newData: newRaces,
    });
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
            {race.name}
          </h2>
          {openModals[race.id] && (
            <EditRaceModal
              race={race}
              closeModal={closeModal}
              updateRace={updateRace}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Races;
