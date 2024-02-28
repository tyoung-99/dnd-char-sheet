import { useState, useEffect } from "react";
import axios from "axios";
import CatalogueRaceListComp from "../../components/catalogueComponents/CatalogueRaceListComp";
import CatalogueRacialFeaturesComp from "../../components/catalogueComponents/CatalogueRacialFeaturesComp";

const AdminRacesTab = () => {
  const [raceList, setRaceList] = useState([]);
  const [racialFeatures, setRaceFeatures] = useState([]);
  const [selectedRace, setSelectedRace] = useState("");
  const [selectedModal, setSelectedModal] = useState("");

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

  const deleteRace = async (id) => {
    try {
      const response = await axios.delete(`/api/races/${id}/delete`);
      setRaceList(response.data);
    } catch (error) {
      console.log("Error deleting race, id:", id);
    }
  };

  const deleteSubRace = async (id) => {
    try {
      await axios.delete(`/api/subraces/${id}/delete`);
    } catch (error) {
      console.log("Error deleting subrace, id:", id);
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

  // const
  return (
    <>
      <div className="row-flex">
        <h1>Races</h1>
        <button className="admin-create">+</button>
      </div>
      <div className="row-flex wrap">
        <CatalogueRaceListComp
          itemList={raceList}
          handleDelete={deleteRace}
          subDelete={deleteSubRace}
          selectedRace={selectedRace}
          setSelectedRace={setSelectedRace}
          selectedModal={selectedModal}
          setSelectedModal={setSelectedModal}
        />
      </div>
      <div className="row-flex">
        <h1>Racial Features</h1>
        <button className="admin-create">+</button>
      </div>
      <div className="row-flex wrap">
        <CatalogueRacialFeaturesComp
          itemList={racialFeatures}
          handleDelete={deleteRaceFeature}
        />
      </div>
    </>
  );
};

export default AdminRacesTab;
