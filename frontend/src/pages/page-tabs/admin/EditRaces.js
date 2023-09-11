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

      let defaultOpenModals = {};
      newRaces.forEach((race) => {
        defaultOpenModals[race.name] = false;
      });
      setOpenModalsAll(defaultOpenModals);
    };
    loadData();
  }, []);

  const setOpenModalOne = (event) => {
    const raceName = event.target.id;
    const newOpenModals = { ...openModals };
    newOpenModals[raceName] = true;
    setOpenModalsAll(newOpenModals);
  };

  const closeModal = (openRaceName) => {
    const newOpenModals = { ...openModals };
    newOpenModals[openRaceName] = false;
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

  const addRace = () => {
    const newRaces = [...races];
    newRaces.push();
  };

  if (!races) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button onClick={addRace}>Add Race</button>
      {races.map((race) => (
        <div key={race.id}>
          <h2 className="edit-link" id={race.name} onClick={setOpenModalOne}>
            {race.name}
          </h2>
          {openModals[race.name] && (
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
