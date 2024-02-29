// Modal to view current race/features and change either race or available feature choices

import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import GenericModal from "./GenericModal";
import "../../styling/components/modals/RaceModal.css";

const RaceModal = ({ character, closeModal }) => {
  const srcList = useRef();
  const [raceOptions, setRaceOptions] = useState();
  const [raceDropdownOptions, setRaceDropdownOptions] = useState();
  const [subraceOptions, setSubraceOptions] = useState();
  const [subraceDropdownOptions, setSubraceDropdownOptions] = useState();

  const [raceId, setRaceId] = useState();
  const [subraceId, setSubraceId] = useState();
  const [featureChoices, setFeatureChoices] = useState();
  const [selectedFeature, setSelectedFeature] = useState(["race", 0]);

  const currentRace =
    raceId && raceId !== ""
      ? raceOptions.find((checkRace) => checkRace._id === raceId)
      : null;

  const currentSubrace =
    subraceId && subraceId !== ""
      ? subraceOptions.find((checkSubrace) => checkSubrace._id === subraceId)
      : null;

  const replaceIdsWithData = async (race) => {
    race.source = srcList.current.find((source) => source._id === race.source);

    if (race.features.length > 0) {
      race.features = (
        await axios.get(`/api/racialFeatures/multiple/${race.features}`)
      ).data;
    }
  };

  const updateSubraceOptions = useCallback(async (newRaceId) => {
    const subraces = (await axios.get(`/api/races/${newRaceId}/subraces`)).data;
    for (const subrace of subraces) await replaceIdsWithData(subrace);
    setSubraceOptions(subraces);

    const newDropdownOptions = subraces.map((subrace) => ({
      _id: subrace._id,
      name: `${subrace.name} (${subrace.source.abbr})`,
    }));
    setSubraceDropdownOptions(newDropdownOptions);
  }, []);

  useEffect(() => {
    const updateRaceOptions = async () => {
      const races = (await axios.get(`/api/races`)).data;
      for (const race of races) await replaceIdsWithData(race);
      setRaceOptions(races);

      const newDropdownOptions = races.map((race) => ({
        _id: race._id,
        name: `${race.name} (${race.source.abbr})`,
      }));
      setRaceDropdownOptions(newDropdownOptions);
    };

    const loadData = async () => {
      srcList.current = (await axios.get(`/api/sources`)).data;

      await updateRaceOptions();

      setRaceId(character.race.raceId || "");
      if (character.race.raceId) {
        await updateSubraceOptions(character.race.raceId);
      }
      setSubraceId(character.race.subraceId || "");

      setFeatureChoices(character.race.featureChoices || {});
    };
    loadData();
  }, [character.race, updateSubraceOptions]);

  const updateFeatureChoices = (oldChoices, typeChanged, oldId, newId) => {
    let newChoices = { ...oldChoices };
    let raceOrSubraceOptions;

    if (typeChanged === "race") {
      newChoices = {};
      raceOrSubraceOptions = raceOptions;
    } else {
      raceOrSubraceOptions = subraceOptions;
      if (oldId) {
        const toRemove = raceOrSubraceOptions
          .find((checkRace) => checkRace._id === oldId)
          .features.map((feature) => feature._id);
        for (const featureId of Object.keys(newChoices)) {
          if (toRemove.includes(featureId)) {
            delete newChoices[featureId];
          }
        }
      }
    }

    const toAdd = raceOrSubraceOptions.find(
      (checkRace) => checkRace._id === newId
    ).features;

    for (const feature of toAdd) {
      if (
        feature.effects.length === 0 ||
        !feature.effects.some((checkEffect) => checkEffect.changes.choices)
      )
        continue;

      let addEffects = {};

      for (const effect of feature.effects) {
        let newChoice;
        const choices = effect.changes.choices;
        switch (effect.category) {
          case "Language":
            newChoice = new Array(choices);
            break;
          case "AbilityScore":
            newChoice = [
              { ability: "STR", amount: 0 },
              { ability: "DEX", amount: 0 },
              { ability: "CON", amount: 0 },
              { ability: "INT", amount: 0 },
              { ability: "WIS", amount: 0 },
              { ability: "CHA", amount: 0 },
            ];

            break;
          default:
        }

        addEffects[effect.category] = newChoice;
      }

      newChoices[feature._id] = addEffects;
    }

    setFeatureChoices(newChoices);
  };

  const getFeatureChoiceInputs = (featureId, category, choices) => {
    if (!featureChoices[featureId] || !featureChoices[featureId][category]) {
      return null;
    }

    let optionsDisplay;
    switch (category) {
      case "Language":
        let inputs = [];
        for (let i = 0; i < choices; i++) {
          inputs.push(
            <input
              key={i}
              id={`Language ${i}`}
              name={`Language ${i}`}
              type="text"
              value={featureChoices[featureId][category][i]}
              onChange={(event) => {
                const newChoices = { ...featureChoices };
                newChoices[featureId][category][i] = event.target.value;
                setFeatureChoices(newChoices);
              }}
            ></input>
          );
        }
        optionsDisplay = (
          <>
            <label>Extra language{inputs.length > 1 ? "s" : ""}:</label>
            {inputs}
          </>
        );
        break;
      case "AbilityScore":
        optionsDisplay = (
          <>
            <h2>Points Available: {choices.pointsAvailable}</h2>
            <ul className="ability-scores">
              {featureChoices[featureId][category].map((ability) => (
                <li key={ability.ability}>
                  <span>{ability.ability}</span>
                  <span>
                    {ability.amount}
                    <div className="button-holder">
                      <button>+</button>
                      <button>-</button>
                    </div>
                  </span>
                </li>
              ))}
            </ul>
          </>
        );
        break;
      default:
    }
    return optionsDisplay;
  };

  const header = null;

  const raceFeatures = (
    <>
      {!currentRace ? (
        <p className="feature-name placeholder">Select a race</p>
      ) : currentRace.features.length === 0 ? null : (
        currentRace.features.map((feature, i) => (
          <p
            key={i}
            className="feature-name"
            onClick={() => setSelectedFeature(["race", i])}
          >
            {feature.displayName}
          </p>
        ))
      )}
    </>
  );

  const subraceFeatures = (
    <>
      {!currentSubrace ? (
        <p className="feature-name placeholder">Select a subrace</p>
      ) : currentSubrace.features.length === 0 ? null : (
        currentSubrace.features.map((feature, i) => (
          <p
            key={i}
            className="feature-name"
            onClick={() => setSelectedFeature(["subrace", i])}
          >
            {feature.displayName}
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
        value={raceId}
        onChange={async (event) => {
          updateFeatureChoices(
            featureChoices,
            "race",
            raceId,
            event.target.value
          );
          setRaceId(event.target.value);
          setSubraceId("");
          setSelectedFeature(["race", 0]);
          await updateSubraceOptions(event.target.value);
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
      {raceFeatures}
    </>
  );

  const subraceSection =
    raceId && !subraceDropdownOptions ? null : raceId &&
      subraceDropdownOptions.length === 0 ? (
      <></>
    ) : (
      <>
        <label htmlFor="subrace" className="category-name">
          Subrace:{" "}
        </label>
        <select
          name="subrace"
          id="subrace"
          value={subraceId}
          onChange={async (event) => {
            updateFeatureChoices(
              featureChoices,
              "subrace",
              subraceId,
              event.target.value
            );
            setSubraceId(event.target.value);
            setSelectedFeature(["race", 0]);
          }}
          disabled={!raceId}
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
        {subraceFeatures}
      </>
    );

  let selectedFeatureData = null;
  if (currentRace && selectedFeature[0] === "race") {
    selectedFeatureData = currentRace.features[selectedFeature[1]];
  } else if (currentSubrace && selectedFeature[0] === "subrace") {
    selectedFeatureData = currentSubrace.features[selectedFeature[1]];
  }

  let selectedFeatureSection = null;
  if (featureChoices && (currentRace || currentSubrace)) {
    selectedFeatureSection = !selectedFeatureData ? (
      <p>This race has no features</p>
    ) : (
      <>
        <h1>{selectedFeatureData.displayName}</h1>
        {selectedFeatureData.description.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
        {selectedFeatureData.effects.map((effect, i) => (
          <div key={i}>
            {getFeatureChoiceInputs(
              selectedFeatureData._id,
              effect.category,
              effect.changes.choices
            )}
          </div>
        ))}
      </>
    );
  }

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

  const savedRace = {
    name: null,
    id: null,
    src: null,
  };
  const savedSubrace = {
    name: null,
    id: null,
    src: null,
  };

  if (currentRace) {
    savedRace.name = currentRace.name;
    savedRace.id = currentRace._id;
    savedRace.src = currentRace.source._id;

    if (subraceDropdownOptions && subraceDropdownOptions.length === 0) {
      savedSubrace.name = currentRace.name; // Subrace name is what gets displayed primarily on sheet
    } else if (currentSubrace) {
      savedSubrace.name = currentSubrace.displayName;
      savedSubrace.id = currentSubrace._id;
      savedSubrace.src = currentSubrace.source._id;
    } else {
      savedSubrace.name = currentRace.name + " [Select subrace]";
    }
  } else {
    savedSubrace.name = "[Select race]";
  }

  const footer = (
    <>
      <button onClick={closeModal}>Cancel</button>
      <button
        onClick={() => {
          character.setRace(savedRace, savedSubrace, featureChoices);
          closeModal();
        }}
      >
        Save
      </button>
    </>
  );

  console.log(featureChoices);

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
