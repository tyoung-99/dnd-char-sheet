import GenericModal from "../GenericModal";
import axios from "axios";
import { useEffect, useState } from "react";
import EditFeatureEffectsComp from "../../catalogueComponents/EditFeatureEffectsComp";
import EditorConvertToJSON from "../../EditorConvertToJSON";

const EditRaceFeatureModal = ({
  racialFeature,
  closeModal,
  addNewRacialFeature,
}) => {
  const [name, setName] = useState(
    racialFeature.name ? racialFeature.name : "New Racial Feature"
  );
  const [displayName, setDisplayName] = useState(
    racialFeature.displayName ? racialFeature.displayName : "Display Name"
  );
  const [description, setDescription] = useState(
    racialFeature.description ? racialFeature.description : {}
  );
  const [isReplaced, setIsReplaced] = useState(
    racialFeature.replaces
      ? racialFeature.replaces.length === 0
        ? false
        : true
      : false
  );
  const [visibility, setVisibility] = useState(
    racialFeature.invisible ? !racialFeature.invisible : true
  );
  const [effects, setEffects] = useState(
    racialFeature.effects ? racialFeature.effects : []
  );
  const [racialFeatures, setRacialFeatures] = useState([]);
  const [replacedFeatures, setReplacedFeatures] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const loadSources = async () => {
      const response = await axios.get("/api/racialFeatures");
      // create an object with ids and names for the replaced features
      // works with empty list for creating new racial feature
      const newReplacedFeatures = racialFeature.replaces
        ? racialFeature.replaces.map((feature) => ({
            id: feature,
            name: response.data.find(
              (compFeature) => compFeature._id === feature
            ).name,
          }))
        : [];
      setReplacedFeatures(newReplacedFeatures);
      // remove the added features from the feature list AS WELL as the current feature (so it can't replace itself)
      setRacialFeatures(
        response.data.filter(
          (feature) =>
            !newReplacedFeatures.some(
              (addedFeature) => addedFeature.id === feature._id
            ) && feature._id !== racialFeature._id
        )
      );
    };

    loadSources();
  }, [racialFeature._id, racialFeature.replaces]);

  const addFeature = (feat_id, name) => {
    setReplacedFeatures((currFeats) => [
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
    setReplacedFeatures((currFeats) =>
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

  const saveRacialFeature = async () => {
    const newReplacedFeatures = replacedFeatures.map((feature) => feature.id);

    const RacialFeatureData = {
      name: name,
      displayName: displayName,
      description: description,
      effects: effects,
      replaces: newReplacedFeatures,
      invisible: !visibility,
    };
    // updates the on screen info without need of backend return
    racialFeature.name = name;
    racialFeature.displayName = displayName;
    racialFeature.description = description;
    racialFeature.effects = effects;
    racialFeature.replaces = newReplacedFeatures;
    racialFeature.invisible = !visibility;
    // function addNewRacial Feature only is passed to this modal when user used create button. Handles post
    addNewRacialFeature
      ? addNewRacialFeature(RacialFeatureData)
      : await axios.put(
          `/api/racialFeature/${racialFeature._id}/update`,
          RacialFeatureData
        );
  };

  const header = null;
  const body = (
    <>
      <div className="row-flex admin-center">
        <div
          className="col-1 name-box"
          contentEditable="true"
          onBlur={(event) => setName(event.currentTarget.textContent)}
          suppressContentEditableWarning={true}
        >
          {name}
        </div>
      </div>
      <div className="row-flex">
        <h2>Display Name:</h2>
        <div
          className="display-name-box"
          contentEditable="true"
          onBlur={(event) => setDisplayName(event.currentTarget.textContent)}
          suppressContentEditableWarning={true}
        >
          {displayName}
        </div>
      </div>
      <div className="row-flex">
        <input
          type="checkbox"
          id="visible"
          name="visible"
          checked={visibility}
          onChange={() => setVisibility((prev) => !prev)}
        ></input>
        <label>Make Visible on Features Tab</label>
      </div>
      <hr></hr>
      <h2>Description</h2>
      <div className="feature-description">
        <EditorConvertToJSON
          wrapperClassName="wysiwyg-textbox-wrapper"
          editorClassName="wysiwyg-textbox-editor"
          onBlur={(contentJSON) => setDescription(contentJSON)}
          defaultTextJSON={description}
        />
      </div>

      <hr></hr>
      <input
        type="checkbox"
        id="replaces"
        name="replaces"
        checked={isReplaced}
        onChange={() => setIsReplaced((prev) => !prev)}
      ></input>
      <label>Replaces</label>
      {isReplaced && (
        <>
          <div className="row-flex">
            <div className="col-1_2">
              <h2>Replaces</h2>
              {replacedFeatures &&
                replacedFeatures.map((feature) => (
                  <span
                    key={feature.id}
                    className="added-feature"
                    onClick={() => removeFeature(feature.id, feature.name)}
                  >
                    {feature.name}
                  </span>
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
              <div className="scrollable-list list-with-columns">
                {racialFeatures &&
                  racialFeatures
                    .filter((feature) =>
                      feature.name
                        .toLowerCase()
                        .match(searchInput.toLowerCase())
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
      )}
      <EditFeatureEffectsComp effects={effects} setEffects={setEffects} />
    </>
  );

  const footer = (
    <>
      <button onClick={closeModal}>Cancel</button>
      <button
        onClick={() => {
          saveRacialFeature();
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
      category={"raceFeatureAdmin"}
    />
  );
};

export default EditRaceFeatureModal;
