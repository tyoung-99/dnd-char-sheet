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

  const [raceData, setRaceData] = useState();
  const [raceDropdownOptions, setRaceDropdownOptions] = useState();

  let selectedRace = {
    nameIndex: -1,
    srcIndex: -1,
    subrace: {
      nameIndex: -1,
      srcIndex: -1,
    },
  };

  if (raceDropdownOptions && character.race.name) {
    selectedRace.nameIndex = raceDropdownOptions.findIndex(
      (checkRace) => checkRace.name === character.race.name
    );

    if (character.race.source) {
      selectedRace.srcIndex = raceDropdownOptions[
        selectedRace.nameIndex
      ].sources.findIndex(
        (checkSource) => checkSource.name === character.race.source
      );

      if (character.race.subrace.name) {
        selectedRace.subrace.nameIndex = raceDropdownOptions[
          selectedRace.nameIndex
        ].sources[selectedRace.srcIndex].subraces.findIndex(
          (checkSubrace) => checkSubrace.name === character.race.subrace.name
        );

        if (character.race.subrace.source) {
          selectedRace.subrace.srcIndex = raceDropdownOptions[
            selectedRace.nameIndex
          ].sources[selectedRace.srcIndex].subraces[
            selectedRace.subrace.nameIndex
          ].sources.findIndex(
            (checkSource) =>
              checkSource.source === character.race.subrace.source
          );
        }
      }
    }
  }

  useEffect(() => {
    const loadData = async () => {
      const newRaceData = await axios.get("/api/data/races");

      const races = newRaceData.data.race;
      const subraces = newRaceData.data.subrace;

      const newDropdownOptions = [];

      races.forEach((race) => {
        if (race.traitTags && race.traitTags.includes("NPC Race")) {
          return;
        }

        const index = newDropdownOptions.findIndex(
          (element) => element.name === race.name
        );
        if (index < 0) {
          newDropdownOptions.push({
            name: race.name,
            sources: [{ name: race.source, subraces: [] }],
          });
        } else {
          newDropdownOptions[index].sources.push({
            name: race.source,
            subraces: [],
          });
        }
      });

      subraces.forEach((subrace) => {
        const raceIndex = newDropdownOptions.findIndex(
          (element) => element.name === subrace.raceName
        );
        const raceSrcIndex = newDropdownOptions[raceIndex].sources.findIndex(
          (element) => element.name === subrace.raceSource
        );
        const subraceIndex = newDropdownOptions[raceIndex].sources[
          raceSrcIndex
        ].subraces.findIndex((element) => element.name === subrace.name);

        if (subraceIndex < 0) {
          newDropdownOptions[raceIndex].sources[raceSrcIndex].subraces.push({
            name: subrace.name ? subrace.name : "None",
            sources: [subrace.source],
          });
        } else {
          newDropdownOptions[raceIndex].sources[raceSrcIndex].subraces[
            subraceIndex
          ].sources.push(subrace.source);
        }
      });

      setRaceData(newRaceData);
      setRaceDropdownOptions(newDropdownOptions);
    };
    loadData();
  }, []);

  const updateRace = (event) => {
    let selection = event.target.value;
    const newRace = { ...selectedRace };
    switch (event.target.name) {
      case "race-dropdown":
        newRace.nameIndex = raceDropdownOptions.findIndex(
          (checkRace) => checkRace.name === selection
        );

        if (raceDropdownOptions[newRace.nameIndex].sources.length === 1) {
          newRace.srcIndex = 0;
        } else {
          newRace.srcIndex = -1;
        }

        newRace.subrace = { nameIndex: -1, srcIndex: -1 };
        break;

      case "race-src-dropdown":
        newRace.srcIndex = raceDropdownOptions[
          newRace.nameIndex
        ].sources.findIndex((checkSrc) => checkSrc.name === selection);
        newRace.subrace = { nameIndex: -1, srcIndex: -1 };
        break;

      case "subrace-dropdown":
        newRace.subrace.nameIndex = raceDropdownOptions[
          newRace.nameIndex
        ].sources[newRace.srcIndex].subraces.findIndex((checkSubrace) => {
          return (
            checkSubrace.name === selection ||
            (!checkSubrace.name && selection === "None")
          );
        });

        if (
          raceDropdownOptions[newRace.nameIndex].sources[newRace.srcIndex]
            .subraces[newRace.subrace.nameIndex].sources.length === 1
        ) {
          newRace.subrace.srcIndex = 0;
        } else {
          newRace.subrace.srcIndex = -1;
        }
        break;

      case "subrace-src-dropdown":
        newRace.subrace.srcIndex = raceDropdownOptions[
          newRace.nameIndex
        ].sources[newRace.srcIndex].subraces[
          newRace.subrace.nameIndex
        ].sources.findIndex((checkSrc) => {
          return checkSrc === selection;
        });
        break;

      default:
        return;
    }

    let charUpdate = {
      race: {
        name: raceDropdownOptions[newRace.nameIndex].name,
        source: null,
        subrace: { name: null, source: null },
      },
    };

    if (newRace.srcIndex >= 0) {
      charUpdate.race.source =
        raceDropdownOptions[newRace.nameIndex].sources[newRace.srcIndex].name;

      if (newRace.subrace.nameIndex >= 0) {
        charUpdate.race.subrace.name =
          raceDropdownOptions[newRace.nameIndex].sources[
            newRace.srcIndex
          ].subraces[newRace.subrace.nameIndex].name;

        if (newRace.subrace.srcIndex >= 0) {
          charUpdate.race.subrace.source =
            raceDropdownOptions[newRace.nameIndex].sources[
              newRace.srcIndex
            ].subraces[newRace.subrace.nameIndex].sources[
              newRace.subrace.srcIndex
            ];
        }
      }
    }

    updateCharacter(charUpdate);
    promptHeader();
  };

  const raceSection = (
    <div className="grid-tile">
      <h1>Race</h1>
      {raceDropdownOptions ? (
        <>
          <div className="row-flex race-line">
            <label className="col-1 race-label" htmlFor="race-dropdown">
              Race:
            </label>
            <select
              className="col-3"
              name="race-dropdown"
              value={character.race.name ? character.race.name : "Select Race"}
              onChange={updateRace}
            >
              <option disabled hidden>
                Select Race
              </option>
              {raceDropdownOptions.map((race, i) => (
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
                  name="race-src-dropdown"
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
                  {raceDropdownOptions[selectedRace.nameIndex].sources.map(
                    (source, i) => (
                      <option key={i}>{source.name}</option>
                    )
                  )}
                </select>
              </>
            ) : null}
          </div>
          {selectedRace.srcIndex >= 0 &&
          raceDropdownOptions[selectedRace.nameIndex].sources[
            selectedRace.srcIndex
          ].subraces.length > 0 ? (
            <div className="row-flex race-line">
              <label className="col-1 race-label" htmlFor="subrace-dropdown">
                Subrace:
              </label>
              <select
                className="col-3"
                name="subrace-dropdown"
                value={
                  character.race.subrace.name
                    ? character.race.subrace.name
                    : "Select Subrace"
                }
                onChange={updateRace}
              >
                <option disabled hidden>
                  Select Subrace
                </option>
                {raceDropdownOptions[selectedRace.nameIndex].sources[
                  selectedRace.srcIndex
                ].subraces.map((subrace, i) => (
                  <option key={i}>{subrace.name}</option>
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
                    name="subrace-src-dropdown"
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
                    {raceDropdownOptions[selectedRace.nameIndex].sources[
                      selectedRace.srcIndex
                    ].subraces[selectedRace.subrace.nameIndex].sources.map(
                      (source, i) => (
                        <option key={i}>{source}</option>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default General;
