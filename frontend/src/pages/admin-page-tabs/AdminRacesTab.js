import { useState, useEffect } from "react";
import axios from "axios";
import CatalogueRaceListComp from "../../components/catalogueComponents/CatalogueRaceListComp";
import CatalogueRacialFeaturesComp from "../../components/catalogueComponents/CatalogueRacialFeaturesComp";
import EditRaceModal from "../../components/modals/adminModals/EditRaceModal";

const AdminRacesTab = () => {
  const [raceList, setRaceList] = useState([]);
  const [racialFeatures, setRaceFeatures] = useState([]);
  const [selectedRace, setSelectedRace] = useState("");
  const [currentModal, setCurrentModal] = useState("");

  useEffect(() => {
    const loadRaces = async () => {
      let response = await axios.get("/api/races");
      setRaceList(response.data);
      response = await axios.get("/api/racialFeatures");
      setRaceFeatures(response.data);
    };
    loadRaces();
  }, []);

  if (!raceList) {
    return <div>Loading...</div>;
  }

  const addRace = async (newData) => {
    const response = await axios.post(`/api/races/insert`, newData);
    setRaceList(response.data);
  };

  const deleteRace = async (id) => {
    try {
      let response = await axios.delete(`/api/races/${id}/delete`);
      setRaceList(response.data);
      // delete all subraces
      response = await axios.get(`/api/races/${id}/subraces`);
      for (const subrace of response.data) {
        await axios.delete(`/api/subraces/${subrace._id}/delete/`);
      }
    } catch (error) {
      console.log("Error deleting race, id:", id);
    }
  };

  const deleteRaceFeature = async (id) => {
    try {
      const response = await axios.delete(`/api/races/${id}/delete`);
      setRaceFeatures(response.data);
    } catch (error) {
      console.log("Error deleting racial feature, id:", id);
    }
  };

  const closeModal = () => {
    setCurrentModal("");
  };

  // const
  return (
    <>
      <div className="row-flex">
        <h1>Races</h1>
        <button
          className="admin-create"
          onClick={() => setCurrentModal("createRace")}
        >
          +
        </button>
        {currentModal === "createRace" && (
          <EditRaceModal race={{}} closeModal={closeModal} addRace={addRace} />
        )}
      </div>
      <div className="row-flex wrap">
        <CatalogueRaceListComp
          raceList={raceList}
          handleDelete={deleteRace}
          selectedRace={selectedRace}
          setSelectedRace={setSelectedRace}
          currentModal={currentModal}
          setCurrentModal={setCurrentModal}
          closeModal={closeModal}
        />
      </div>
      <div className="row-flex">
        <h1>Racial Features</h1>
        <button className="admin-create">+</button>
      </div>
      <div className="row-flex wrap">
        <CatalogueRacialFeaturesComp
          racialFeatures={racialFeatures}
          handleDelete={deleteRaceFeature}
          currentModal={currentModal}
          setCurrentModal={setCurrentModal}
          closeModal={closeModal}
        />
      </div>
    </>
  );
};

export default AdminRacesTab;
