import { useState, useEffect } from "react";
import axios from "axios";
import CatalogueListComp from "../../components/CatalogueListComp";

const AdminRacesTab = () => {
  const [raceList, setRaceList] = useState([]);

  useEffect(() => {
    const loadRaces = async () => {
      const response = await axios.get("/api/races");
      setRaceList(response.data);
    };
    loadRaces();
  }, []);

  if (!raceList) {
    return <div>Loading...</div>;
  }

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/api/races/${id}/delete`);
      setRaceList(response.data);
    } catch (error) {
      console.log("Error deleting race, id:", id);
    }
  };

  // const
  return (
    <>
      <div className="row-flex">
        <button className="admin-create">+</button>
      </div>
      <div className="row-flex">
        <CatalogueListComp itemList={raceList} handleDelete={handleDelete} />
      </div>
    </>
  );
};

export default AdminRacesTab;
