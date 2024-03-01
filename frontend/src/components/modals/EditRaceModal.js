import GenericModal from "./GenericModal";
import axios from "axios";
import { useEffect, useState } from "react";

const EditRaceModal = ({ race, closeModal }) => {
  const [name, setName] = useState(race.name);
  const [currentSource, setCurrentSource] = useState(race.source);
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
      const newRacialFeatures = race.features.map((feature) => ({
        id: feature,
        name: response.data.find((compFeature) => compFeature._id === feature)
          .name,
      }));
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

  const header = null;
  const body = (
    <>
      <div className="row-flex">
        <div
          className="col-1_2 name-box"
          contentEditable="true"
          onBlur={(event) => setName(event.currentTarget.textContent)}
          suppressContentEditableWarning={true}
        >
          {name}
        </div>
        <div className="col-1_2">
          <label htmlFor="sources">Source:</label>
          <select
            name="sources"
            onChange={(event) => setCurrentSource(event.currentTarget.value)}
            value={currentSource}
          >
            {sources.map((source) => (
              <option key={source._id} value={source._id}>
                {source.abbr}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="row-flex">
        <div className="col-1_2">
          {addedRacialFeatures &&
            addedRacialFeatures.map((feature) => (
              <div
                key={feature.id}
                onClick={() => removeFeature(feature.id, feature.name)}
              >
                {feature.name}
              </div>
            ))}
        </div>
        <div className="col-1_2 ">
          <input
            type="text"
            className="search-bar"
            placeholder="Search..."
            onChange={(e) => setSearchInput(e.currentTarget.value)}
          ></input>
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
          console.log(name, currentSource);
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

export default EditRaceModal;
