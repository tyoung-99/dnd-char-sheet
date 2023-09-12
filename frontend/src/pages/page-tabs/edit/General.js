// General character info, such as name, alignment, race, background, plus all associated features
import "../../../styling/General.css";
import { useEffect, useState } from "react";
import axios from "axios";

const General = ({ character, updateCharacter, promptHeader }) => {
  const alignmentList = [
    "Lawful Good",
    "Lawful Neutral",
    "Lawful Evil",
    "Neutral Good",
    "True Neutral",
    "Neutral Evil",
    "Chaotic Good",
    "Chaotic Neutral",
    "Chaotic Evil",
  ];
  const backgroundList = ["Background 1", "Background 2", "Background 3"];

  const [raceOptions, setRaceOptions] = useState();

  let selectedRace = {
    nameIndex: -1,
    srcIndex: -1,
    subrace: {
      nameIndex: -1,
      srcIndex: -1,
    },
  };

  if (raceOptions && character.race.name) {
    selectedRace.nameIndex = raceOptions.findIndex(
      (checkRace) => checkRace.name === character.race.name
    );

    if (character.race.source) {
      selectedRace.srcIndex = raceOptions[
        selectedRace.nameIndex
      ].sources.findIndex(
        (checkSource) => checkSource.name === character.race.source
      );

      if (character.race.subrace.name || character.race.subrace.name === "") {
        selectedRace.subrace.nameIndex = raceOptions[
          selectedRace.nameIndex
        ].sources[selectedRace.srcIndex].subraces.findIndex(
          (checkSubrace) => checkSubrace.name === character.race.subrace.name
        );

        if (character.race.subrace.source) {
          selectedRace.subrace.srcIndex = raceOptions[
            selectedRace.nameIndex
          ].sources[selectedRace.srcIndex].subraces[
            selectedRace.subrace.nameIndex
          ].sources.findIndex(
            (checkSource) =>
              checkSource.name === character.race.subrace.source.name
          );
        }
      }
    }
  }

  useEffect(() => {
    const loadData = async () => {
      const newRaceOptions = (await axios.get("/api/data/races")).data;
      setRaceOptions(newRaceOptions);
    };
    loadData();
  }, []);

  const updateRace = (event) => {
    let selection = event.target.value;
    const newRace = { ...selectedRace };
    switch (event.target.id) {
      case "race-dropdown":
        newRace.nameIndex = raceOptions.findIndex(
          (checkRace) => checkRace.name === selection
        );

        if (raceOptions[newRace.nameIndex].sources.length === 1) {
          newRace.srcIndex = 0;
        } else {
          newRace.srcIndex = -1;
        }

        newRace.subrace = { nameIndex: -1, srcIndex: -1 };
        break;

      case "race-src-dropdown":
        newRace.srcIndex = raceOptions[newRace.nameIndex].sources.findIndex(
          (checkSrc) => checkSrc.name === selection
        );
        newRace.subrace = { nameIndex: -1, srcIndex: -1 };
        break;

      case "subrace-dropdown":
        newRace.subrace.nameIndex = raceOptions[newRace.nameIndex].sources[
          newRace.srcIndex
        ].subraces.findIndex((checkSubrace) => {
          return (
            checkSubrace.name === selection ||
            (checkSubrace.name === "" && selection === "None")
          );
        });

        if (
          raceOptions[newRace.nameIndex].sources[newRace.srcIndex].subraces[
            newRace.subrace.nameIndex
          ].sources.length === 1
        ) {
          newRace.subrace.srcIndex = 0;
        } else {
          newRace.subrace.srcIndex = -1;
        }
        break;

      case "subrace-src-dropdown":
        newRace.subrace.srcIndex = raceOptions[newRace.nameIndex].sources[
          newRace.srcIndex
        ].subraces[newRace.subrace.nameIndex].sources.findIndex((checkSrc) => {
          return checkSrc.name === selection;
        });
        break;

      default:
        return;
    }

    let charUpdate = {
      race: {
        name: raceOptions[newRace.nameIndex].name,
        source: null,
        subrace: { name: null, source: null },
        traits: [],
      },
    };

    if (newRace.srcIndex >= 0) {
      charUpdate.race.source =
        raceOptions[newRace.nameIndex].sources[newRace.srcIndex].name;

      charUpdate.race.traits =
        raceOptions[newRace.nameIndex].sources[newRace.srcIndex].traits;

      if (newRace.subrace.nameIndex >= 0) {
        charUpdate.race.subrace.name =
          raceOptions[newRace.nameIndex].sources[newRace.srcIndex].subraces[
            newRace.subrace.nameIndex
          ].name;

        if (newRace.subrace.srcIndex >= 0) {
          charUpdate.race.subrace.source =
            raceOptions[newRace.nameIndex].sources[newRace.srcIndex].subraces[
              newRace.subrace.nameIndex
            ].sources[newRace.subrace.srcIndex].name;

          charUpdate.race.traits = charUpdate.race.traits.concat(
            raceOptions[newRace.nameIndex].sources[newRace.srcIndex].subraces[
              newRace.subrace.nameIndex
            ].sources[newRace.subrace.srcIndex].traits
          );
        }
      }
    }

    updateCharacter(charUpdate);
    promptHeader();
  };

  const raceSection = (
    <div className="grid-tile">
      <h1>Race</h1>
      {raceOptions ? (
        <>
          <div className="row-flex race-line">
            <label className="col-1 race-label" htmlFor="race-dropdown">
              Race:
            </label>
            <select
              className="col-3"
              id="race-dropdown"
              value={character.race.name ? character.race.name : "Select Race"}
              onChange={updateRace}
            >
              <option disabled hidden>
                Select Race
              </option>
              {raceOptions.map((race, i) => (
                <option key={i}>{race.name}</option>
              ))}
            </select>
            {selectedRace.nameIndex >= 0 ? (
              <>
                <label className="col-1 race-label" htmlFor="race-src-dropdown">
                  Source:
                </label>
                <select
                  className="col-3"
                  id="race-src-dropdown"
                  value={
                    character.race.source
                      ? character.race.source
                      : "Select Race Source"
                  }
                  onChange={updateRace}
                >
                  <option disabled hidden>
                    Select Race Source
                  </option>
                  {raceOptions[selectedRace.nameIndex].sources.map(
                    (source, i) => (
                      <option key={i}>{source.name}</option>
                    )
                  )}
                </select>
              </>
            ) : null}
          </div>
          {selectedRace.srcIndex >= 0 &&
          raceOptions[selectedRace.nameIndex].sources[selectedRace.srcIndex]
            .subraces.length > 0 ? (
            <div className="row-flex race-line">
              <label className="col-1 race-label" htmlFor="subrace-dropdown">
                Subrace:
              </label>
              <select
                className="col-3"
                id="subrace-dropdown"
                value={
                  character.race.subrace.name
                    ? character.race.subrace.name
                    : character.race.subrace.name === ""
                    ? "None"
                    : "Select Subrace"
                }
                onChange={updateRace}
              >
                <option disabled hidden>
                  Select Subrace
                </option>
                {raceOptions[selectedRace.nameIndex].sources[
                  selectedRace.srcIndex
                ].subraces.map((subrace, i) => (
                  <option key={i}>
                    {subrace.name === "" ? "None" : subrace.name}
                  </option>
                ))}
              </select>
              {selectedRace.subrace.nameIndex >= 0 ? (
                <>
                  <label
                    className="col-1 race-label"
                    htmlFor="subrace-src-dropdown"
                  >
                    Source:
                  </label>
                  <select
                    className="col-3"
                    id="subrace-src-dropdown"
                    value={
                      character.race.subrace.source
                        ? character.race.subrace.source
                        : "Select Subrace Source"
                    }
                    onChange={updateRace}
                  >
                    <option disabled hidden>
                      Select Subrace Source
                    </option>
                    {raceOptions[selectedRace.nameIndex].sources[
                      selectedRace.srcIndex
                    ].subraces[selectedRace.subrace.nameIndex].sources.map(
                      (source, i) => (
                        <option key={i}>{source.name}</option>
                      )
                    )}
                  </select>
                </>
              ) : null}
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );

  const [, setBackground] = useState(character.background.name);

  const backgroundSection = (
    <div className="col-6 col-flex">
      <div className="grid-tile">
        <h1>Background</h1>
        <select
          name="background"
          defaultValue={
            character.background.name
              ? character.background.name
              : "Select Background"
          }
          onChange={(event) => {
            setBackground(event.target.value);
            updateCharacter({ background: { name: event.target.value } });
          }}
        >
          <option disabled hidden>
            Select Background
          </option>
          {backgroundList.map((background) => (
            <option key={background}>{background}</option>
          ))}
        </select>
      </div>
    </div>
  );

  const updateBackstory = (event) => {
    updateCharacter({ backstory: event.target.value.split("\n") });
  };

  return (
    <div className="grid-container row-flex">
      <div className="col-12 col-flex">
        <div className="grid-container row-flex">
          <div className="col-6 col-flex">
            <div className="grid-tile">
              <h1>Name</h1>
              <input
                className="col-12"
                type="text"
                name="char-name"
                defaultValue={character.name}
                onChange={(event) => {
                  promptHeader();
                  updateCharacter({ name: event.target.value });
                }}
              ></input>
            </div>
            <div className="grid-tile">
              <h1>Alignment</h1>
              <select
                name="alignment"
                defaultValue={
                  character.alignment ? character.alignment : "Select Alignment"
                }
                onChange={(event) => {
                  promptHeader();
                  updateCharacter({ alignment: event.target.value });
                }}
              >
                <option disabled hidden>
                  Select Alignment
                </option>
                {alignmentList.map((alignment) => (
                  <option key={alignment}>{alignment}</option>
                ))}
              </select>
            </div>
            {raceSection}
          </div>
          {backgroundSection}
        </div>
        <div className="col-12 col-flex">
          <div className="grid-tile">
            <h1>Backstory</h1>
            <textarea
              name="backstory"
              className="col-12"
              defaultValue={character.backstory.join("\n")}
              onChange={updateBackstory}
              rows={character.backstory.length}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default General;
