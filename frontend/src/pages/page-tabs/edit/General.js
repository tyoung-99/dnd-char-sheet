// General character info, such as name, alignment, race, background, plus all associated features
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
  const [raceDisplays, setRaceDisplays] = useState();

  const [race, setRace] = useState(character.race.name);
  const [subrace, setSubrace] = useState(character.race.subrace);

  useEffect(() => {
    const loadData = async () => {
      const newRaceData = await axios.get("/api/data/races");

      const races = newRaceData.data.race;
      const subraces = newRaceData.data.subrace;

      const newDisplayData = [];

      races.forEach((race) => {
        if (race.traitTags && race.traitTags.includes("NPC Race")) {
          return;
        }

        const index = newDisplayData.findIndex(
          (element) => element.name === race.name
        );
        if (index < 0) {
          newDisplayData.push({
            name: race.name,
            source: [race.source],
            subrace: [],
          });
        } else {
          newDisplayData[index].source.push(race.source);
        }
      });

      subraces.forEach((subrace) => {
        const raceIndex = newDisplayData.findIndex(
          (element) => element.name === subrace.raceName
        );
        const subraceIndex = newDisplayData[raceIndex].subrace.findIndex(
          (element) => element.name === subrace.name
        );

        if (subraceIndex < 0) {
          newDisplayData[raceIndex].subrace.push({
            name: subrace.name,
            source: [subrace.source],
          });
        } else {
          newDisplayData[raceIndex].subrace[subraceIndex].source.push(
            subrace.source
          );
        }
      });

      setRaceData(newRaceData);
      setRaceDisplays(newDisplayData);
    };
    loadData();
  }, []);

  const updateRace = (event) => {
    setRace(event.target.value);
    promptHeader();
    updateCharacter({ race: { name: event.target.value } });
  };

  let subraceList = [];
  if (race && raceDisplays) {
    subraceList =
      raceDisplays[raceDisplays.findIndex((element) => element.name === race)]
        .subrace;
  }

  const raceSection = (
    <div className="grid-tile">
      <h1>Race</h1>
      <select
        defaultValue={character.race.name ? character.race.name : "Select Race"}
        onChange={updateRace}
      >
        <option disabled hidden>
          Select Race
        </option>
        {raceDisplays
          ? raceDisplays.map((race, i) => (
              <option key={i} value={race.name}>
                {race.name}
              </option>
            ))
          : null}
      </select>
      {subraceList.length > 0 ? (
        <select
          defaultValue={
            character.race.subrace ? character.race.subrace : "Select Subrace"
          }
          onChange={updateRace}
        >
          <option disabled hidden>
            Select Subrace
          </option>
          {subraceList.map((subrace, i) => (
            <option key={i} value={subrace.name}>
              {subrace.name}
            </option>
          ))}
        </select>
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
            <option key={background} value={background}>
              {background}
            </option>
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
                  <option key={alignment} value={alignment}>
                    {alignment}
                  </option>
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
