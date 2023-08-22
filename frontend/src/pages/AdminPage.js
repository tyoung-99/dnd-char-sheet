// Allows updating data on races, classes, etc.
import { useState } from "react";
import axios from "axios";

const AdminPage = () => {
  const uploadFile = async (event) => {
    const file = event.target.files;
    console.log(event.target.name);
    const response = await axios.put(`/api/data/${event.target.name}/update`, {
      newDataFile: file,
    });
    console.log(response);
  };

  return (
    <>
      <h1>Update Data</h1>
      <label htmlFor="races">Races</label>
      <input
        name="races"
        type="file"
        accept=".json"
        onChange={uploadFile}
      ></input>
    </>
  );
};

export default AdminPage;
