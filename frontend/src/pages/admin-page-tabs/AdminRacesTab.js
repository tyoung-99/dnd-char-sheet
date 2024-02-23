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

  // const
  return (
    <>
      <h1>Races Tab</h1>
      <CatalogueListComp />
    </>
  );
};

export default AdminRacesTab;
