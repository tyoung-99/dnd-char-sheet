import GenericModal from "../GenericModal";
import axios from "axios";
import { useEffect, useState } from "react";

const EditSubraceModal = ({ race, closeModal, parentRace, addSubrace }) => {
  const [name, setName] = useState(race.name ? race.name : "New Subrace");
  const [displayName, setDisplayName] = useState(
    race.displayName ? race.displayName : "Display Name"
  );
  const [currentSource, setCurrentSource] = useState(
    race.source ? race.source : "Pick a src"
  );
  const [sources, setSources] = useState([]);
  const [racialFeatures, setRacialFeatures] = useState([]);
  const [addedRacialFeatures, setAddedRacialFeatures] = useState();
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const loadSources = async () => {
      let response = await axios.get("/api/sources");
      setSources(response.data);
      response = await axios.get("/api/racialFeatures");
      // create an object with ids and names for the added features
      // works with empty list for creating new race
      const newRacialFeatures = race.features
        ? race.features.map((feature) => ({
            id: feature,
            name: response.data.find(
              (compFeature) => compFeature._id === feature
            ).name,
          }))
        : [];
      setAddedRacialFeatures(newRacialFeatures);
      // remove the added features from the feature list
      setRacialFeatures(
        response.data.filter(
          (feature) =>
            !newRacialFeatures.some(
              (addedFeature) => addedFeature.id === feature._id
            )
        )
      );
    };

    loadSources();
  }, [race.features]);

  const addFeature = (feat_id, name) => {
    setAddedRacialFeatures((currFeats) => [
      ...currFeats,
      {
        id: feat_id,
        name: name,
      },
    ]);
    setRacialFeatures((currFeats) =>
      currFeats.filter((feat) => feat._id !== feat_id)
    );
  };

  const removeFeature = (feat_id, name) => {
    setAddedRacialFeatures((currFeats) =>
      currFeats.filter((feat) => feat.id !== feat_id)
    );
    setRacialFeatures((currFeats) => [
      ...currFeats,
      {
        _id: feat_id,
        name: name,
      },
    ]);
  };

  const saveSubrace = async () => {
    const newFeatures = addedRacialFeatures.map((feature) => feature.id);
    const newData = {
      name: name,
      displayName: displayName,
      source: currentSource,
      parentRace: parentRace,
      features: newFeatures,
    };
    race.name = name;
    race.source = currentSource;
    race.features = newFeatures;
    race.displayName = displayName;
    addSubrace
      ? addSubrace(newData)
      : await axios.put(`/api/subraces/${race._id}/update`, newData);
  };

  const header = null;
  const body = (
    <>
      <div className="row-flex source-drop">
        <label htmlFor="sources">Source:</label>
        <select
          name="sources"
          onChange={(event) => setCurrentSource(event.currentTarget.value)}
          value={currentSource}
        >
          <option key={"default"} value={"Pick a src"} disabled>
            Pick a src
          </option>
          {sources.map((source) => (
            <option key={source._id} value={source._id}>
              {source.abbr}
            </option>
          ))}
        </select>
      </div>
      <div className="row-flex">
        <div
          className="col-1 name-box"
          contentEditable="true"
          onBlur={(event) => setName(event.currentTarget.textContent)}
          suppressContentEditableWarning={true}
        >
          {name}
        </div>
      </div>
      <h2>Display Name:</h2>
      <div className="row-flex">
        <div
          className="display-name-box"
          contentEditable="true"
          onBlur={(event) => setDisplayName(event.currentTarget.textContent)}
          suppressContentEditableWarning={true}
        >
          {displayName}
        </div>
      </div>
      <hr></hr>
      <div className="row-flex">
        <div className="col-1_2">
          <h2>Race Features</h2>
          {addedRacialFeatures &&
            addedRacialFeatures.map((feature) => (
              <div key={feature.id}>
                <span className="added-feature">{feature.name}</span>
                <span
                  className="delete-button"
                  onClick={() => removeFeature(feature.id, feature.name)}
                >
                  Delete
                </span>
              </div>
            ))}
        </div>
        <div className="col-1_2 ">
          <div className="row-flex">
            <input
              type="text"
              className="search-bar"
              placeholder="Search..."
              onChange={(e) => setSearchInput(e.currentTarget.value)}
            ></input>
          </div>
          <div className="scrollable-list">
            {racialFeatures &&
              racialFeatures
                .filter((feature) =>
                  feature.name.toLowerCase().match(searchInput.toLowerCase())
                )
                .map((feature) => (
                  <div
                    key={feature._id}
                    className="feature-list-item"
                    onClick={() => addFeature(feature._id, feature.name)}
                  >
                    {feature.name}
                  </div>
                ))}
          </div>
        </div>
      </div>
    </>
  );

  const footer = (
    <>
      <button onClick={closeModal}>Cancel</button>
      <button
        onClick={() => {
          saveSubrace();
          closeModal();
        }}
      >
        Save
      </button>
    </>
  );
  return (
    <GenericModal
      header={header}
      body={body}
      footer={footer}
      category={"raceAdmin"}
    />
  );
};

export default EditSubraceModal;
