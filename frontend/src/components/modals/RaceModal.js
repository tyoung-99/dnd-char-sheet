// Modal to view current race/features and change either race or available feature choices

import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import GenericModal from "./GenericModal";
import "../../styling/components/modals/RaceModal.css";

const RaceModal = ({ character, closeModal }) => {
  const [currentRaceId, setCurrentRaceId] = useState(
    character.race.raceId || ""
  );
  const [currentSubraceId, setCurrentSubraceId] = useState(
    character.race.subraceId || ""
  );

  const [raceOptions, setRaceOptions] = useState([]);
  const [raceDropdownOptions, setRaceDropdownOptions] = useState();
  const [subraceOptions, setSubraceOptions] = useState([]);
  const [subraceDropdownOptions, setSubraceDropdownOptions] = useState();

  const sourceList = useRef([]);

  const [displayedFeature, setDisplayedFeature] = useState(["race", 0]);

  const replaceRaceData = useCallback(
    async (races) => {
      for (let race of races) {
        race.source = sourceList.current.find(
          (source) => source._id === race.source
        );

        if (race.features.length > 0) {
          const response = await axios.get(
            `/api/racialFeatures/multiple/${race.features}`
          );
          race.features = response.data;
        }
      }

      return races;
    },
    [sourceList]
  );

  const updateSubraceList = useCallback(
    async (raceId) => {
      const response = await axios.get(`/api/races/${raceId}/subraces`);
      const subraces = await replaceRaceData(response.data);

      setSubraceOptions(subraces);
      setSubraceDropdownOptions(
        subraces.map((subrace) => {
          return {
            _id: subrace._id,
            name: `${subrace.name} (${subrace.source.abbr})`,
          };
        })
      );
    },
    [replaceRaceData]
  );

  const updateRaceSubrace = useCallback(
    async (type, newId) => {
      if (type === "race") {
        await updateSubraceList(newId);
        setCurrentRaceId(newId);
      } else {
        setCurrentSubraceId(newId);
      }
    },
    [updateSubraceList]
  );

  useEffect(() => {
    const loadData = async () => {
      let response = await axios.get(`/api/sources`);
      sourceList.current = response.data;

      response = await axios.get(`/api/races`);
      const races = await replaceRaceData(response.data);

      setRaceOptions(races);
      setRaceDropdownOptions(
        races.map((race) => {
          return {
            _id: race._id,
            name: `${race.name} (${race.source.abbr})`,
          };
        })
      );

      if (character.race.raceId !== "") {
        await updateSubraceList(character.race.raceId);
      }
    };

    loadData();
  }, [character.race.raceId, replaceRaceData, updateSubraceList]);

  const header = null;

  const currentRace = raceOptions.find((race) => race._id === currentRaceId);
  const raceFeaturesDisplay = (
    <>
      {!currentRace ? (
        <p className="feature-name placeholder">Select a race</p>
      ) : currentRace.features.length === 0 ? (
        <p className="feature-name">None</p>
      ) : (
        currentRace.features.map((feature, i) => (
          <p
            key={i}
            className="feature-name"
            title={feature.description.reduce(
              (fullText, paragraph) => (fullText += "\n" + paragraph),
              ""
            )}
          >
            {feature.displayName}
          </p>
        ))
      )}
    </>
  );

  const currentSubrace = subraceOptions.find(
    (subrace) => subrace._id === currentSubraceId
  );
  const subraceFeaturesDisplay = (
    <>
      {!currentSubrace ? (
        <p className="feature-name placeholder">Select a subrace</p>
      ) : currentSubrace.features.length === 0 ? (
        <p className="feature-name">None</p>
      ) : (
        currentSubrace.features.map((feature, i) => (
          <p
            key={i}
            className="feature-name"
            title={feature.description.reduce(
              (fullText, paragraph) => (fullText += "\n" + paragraph),
              ""
            )}
          >
            {feature.name}
          </p>
        ))
      )}
    </>
  );

  const raceSection = !raceDropdownOptions ? null : (
    <>
      <label htmlFor="race" className="category-name">
        Race:{" "}
      </label>
      <select
        name="race"
        id="race"
        value={currentRaceId}
        onChange={async (event) => {
          await updateRaceSubrace("race", event.target.value);
        }}
      >
        <option hidden value={""}>
          Select Race
        </option>
        {raceDropdownOptions.map((option) => (
          <option key={option._id} value={option._id}>
            {option.name}
          </option>
        ))}
      </select>
      {raceFeaturesDisplay}
    </>
  );

  const subraceSection =
    currentRace && !subraceDropdownOptions ? null : (
      <>
        <label htmlFor="subrace" className="category-name">
          Subrace:{" "}
        </label>
        <select
          name="subrace"
          id="subrace"
          value={currentSubraceId}
          onChange={async (event) => {
            await updateRaceSubrace("subrace", event.target.value);
          }}
          disabled={!currentRace}
        >
          <option hidden value={""}>
            Select Subrace
          </option>
          {subraceDropdownOptions &&
            subraceDropdownOptions.map((option) => (
              <option key={option._id} value={option._id}>
                {option.name}
              </option>
            ))}
        </select>
        {subraceFeaturesDisplay}
      </>
    );

  const getFeatureOptions = (category, choices) => {
    let optionsDisplay;
    switch (category) {
      case "Language":
        let inputs = [];
        for (let i = 0; i < choices; i++)
          inputs.push(
            <input
              key={i}
              id={`Language ${i}`}
              name={`Language ${i}`}
              type="text"
            ></input>
          );
        optionsDisplay = (
          <>
            <label>Language choice(s)</label>
            {inputs}
          </>
        );
        break;
      default:
        optionsDisplay = (
          <p key={category}>Error. Feature category not recognized.</p>
        );
    }
    return optionsDisplay;
  };

  let feature = null;
  let selectedFeatureSection = null;
  // if (currentRaceId && currentSubraceId) {
  //   feature =
  //     displayedFeature[0] === "race"
  //       ? currentRaceIdFeatures[displayedFeature[1]]
  //       : currentSubraceIdFeatures[displayedFeature[1]];

  //   selectedFeatureSection = !feature.effects ? (
  //     "unchanged"
  //   ) : (
  //     <>
  //       <h1>{feature.displayName}</h1>
  //       {feature.description.map((paragraph, i) => (
  //         <p key={i}>{paragraph}</p>
  //       ))}
  //       {feature.effects.map((effect) =>
  //         getFeatureOptions(effect.category, effect.changes.choices)
  //       )}
  //     </>
  //   );
  // }

  const body =
    raceSection && subraceSection ? (
      <div className="row-flex">
        <div className="col-1_2">
          {raceSection}
          {subraceSection}
        </div>
        <div className="col-1_2 selected-feature">{selectedFeatureSection}</div>
      </div>
    ) : (
      <p>Loading...</p>
    );

  const footer = (
    <>
      <button onClick={closeModal}>Cancel</button>
      <button
        onClick={() => {
          character.setRace(
            {
              name: currentRace.name,
              id: currentRace._id,
              src: currentRace.source._id,
            },
            {
              name: currentSubrace.displayName,
              id: currentSubrace._id,
              src: currentSubrace.source._id,
            }
          );
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
      category={"race"}
    />
  );
};

export default RaceModal;
