// Modal to view current race/features and change either race or available feature choices

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import GenericModal from "./GenericModal";
import "../../styling/components/modals/RaceModal.css";

const RaceModal = ({ character, closeModal }) => {
  const [raceName, setRaceName] = useState(character.race.name);
  const [raceSrcbook, setRaceSrcbook] = useState(character.race.raceSrcbook);
  const [raceFeatureList, setRaceFeatureList] = useState(
    character.getFeatures({ fromRace: true })
  );
  const [subraceName, setSubraceName] = useState(character.race.subrace);
  const [subraceSrcbook, setSubraceSrcbook] = useState(
    character.race.subraceSrcbook
  );
  const [subraceFeatureList, setSubraceFeatureList] = useState(
    character.getFeatures({ fromSubrace: true })
  );

  // Using arrays w/ current race choices as default to prevent warning sign flashing for a split second
  // (Warning flashes if empty array used b/c current race choices aren't in it)
  const [optionsRaces, optionsSetRaces] = useState([character.race.name]);
  const [optionsRaceSrcbooks, optionsSetRaceSrcbooks] = useState([
    character.race.raceSrcbook,
  ]);
  const [optionsSubraces, optionsSetSubraces] = useState([
    character.race.subrace,
  ]);
  const [optionsSubraceSrcbooks, optionsSetSubraceSrcbooks] = useState([
    character.race.subraceSrcbook,
  ]);

  const changedRace = useRef(false);
  const changedSubrace = useRef(false);

  useEffect(() => {
    const loadRaces = async () => {
      const response = await axios.get(`/api/races/list`);
      optionsSetRaces(response.data);
    };
    loadRaces();
  }, []);

  useEffect(() => {
    const loadRaceSrcbooks = async () => {
      const response = await axios.get(`/api/races/${raceName}/sources`);
      const options = response.data;
      optionsSetRaceSrcbooks(options);
      if (options.length === 1 && changedRace.current)
        setRaceSrcbook(options[0]);
    };
    if (raceName !== "") loadRaceSrcbooks();
  }, [raceName]);

  useEffect(() => {
    const loadRaceFeatures = async () => {
      const response = await axios.get(
        `/api/races/${raceName}/sources/${raceSrcbook}/features`
      );
      setRaceFeatureList(response.data);
    };

    const loadSubraces = async () => {
      const response = await axios.get(
        `/api/races/${raceName}/sources/${raceSrcbook}/subraces/list`
      );
      const options = response.data;
      optionsSetSubraces(options);
      if (options.length === 1 && changedRace.current)
        setSubraceName(options[0]);
    };

    if (raceSrcbook !== "") {
      if (changedRace.current) loadRaceFeatures();
      loadSubraces();
    }
  }, [raceName, raceSrcbook]);

  useEffect(() => {
    const loadSubraceSrcbooks = async () => {
      const response = await axios.get(
        `/api/races/${raceName}/sources/${raceSrcbook}/subraces/${subraceName}/sources`
      );
      const options = response.data;
      optionsSetSubraceSrcbooks(options);
      if (options.length === 1 && changedSubrace.current)
        setSubraceSrcbook(options[0]);
    };
    if (subraceName !== "") loadSubraceSrcbooks();
  }, [raceName, raceSrcbook, subraceName]);

  useEffect(() => {
    const loadSubraceFeatures = async () => {
      const response = await axios.get(
        `/api/races/${raceName}/sources/${raceSrcbook}/subraces/${subraceName}/sources/${subraceSrcbook}/features`
      );
      setSubraceFeatureList(response.data);
    };
    if (subraceSrcbook !== "" && changedSubrace.current) loadSubraceFeatures();
  }, [raceName, raceSrcbook, subraceName, subraceSrcbook]);

  const updateRace = (event) => {
    setRaceName(event.target.value);
    setRaceFeatureList([]);
    updateRaceSrcbook({ target: { value: "" } });
  };

  const updateRaceSrcbook = (event) => {
    changedRace.current = true;
    setRaceSrcbook(event.target.value);
    updateSubrace({ target: { value: "" } });
  };

  const updateSubrace = (event) => {
    setSubraceName(event.target.value);
    setSubraceFeatureList([]);
    updateSubraceSrcbook({ target: { value: "" } });
  };

  const updateSubraceSrcbook = (event) => {
    changedSubrace.current = true;
    setSubraceSrcbook(event.target.value);
  };

  const header = null;

  const raceFeaturesDisplay = (
    <>
      {raceFeatureList.length > 0 ? (
        raceFeatureList.map((feature, i) => (
          <>
            <p
              key={i}
              className="feature-name"
              title={feature.desc.reduce(
                (fullText, paragraph) => (fullText += "\n" + paragraph),
                ""
              )}
            >
              {feature.name}
            </p>
            {feature.effects &&
              feature.effects.map(
                (effect, j) =>
                  effect.changes.choices &&
                  effect.changes.choices.map((_, k) => (
                    <input
                      key={`${j} ${k}`}
                      type="text"
                      placeholder={effect.changes.choicePrompt}
                    ></input>
                  ))
              )}
          </>
        ))
      ) : (
        <p className="feature-name placeholder">Select a race and sourcebook</p>
      )}
    </>
  );
  const subraceFeaturesDisplay = (
    <>
      {subraceFeatureList.length > 0 ? (
        subraceFeatureList.map((feature, i) => (
          <p
            key={i}
            className="feature-name"
            title={feature.desc.reduce(
              (fullText, paragraph) => (fullText += "\n" + paragraph),
              ""
            )}
          >
            {feature.name}
          </p>
        ))
      ) : (
        <p className="feature-name placeholder">
          Select a subrace and sourcebook
        </p>
      )}
    </>
  );

  const raceMissing =
    optionsRaces && !optionsRaces.includes(raceName) && raceName !== "";
  const raceSrcbookMissing =
    optionsRaceSrcbooks &&
    !optionsRaceSrcbooks.includes(raceSrcbook) &&
    raceSrcbook !== "";

  const raceSection = (
    <>
      <label htmlFor="race" className="category-name">
        Race:{" "}
      </label>
      <select name="race" id="race" value={raceName} onChange={updateRace}>
        <option hidden value={""}>
          Select Race
        </option>
        {raceMissing && (
          <option hidden key={raceName} value={raceName}>
            {raceName}
          </option>
        )}
        {optionsRaces &&
          optionsRaces.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
      </select>
      {raceMissing && (
        <img
          src={process.env.PUBLIC_URL + "/icons/danger.png"}
          alt="Race not found"
          className="hover-icon"
          title="This race wasn't found in the available list. If you change it, it will be lost."
        ></img>
      )}
      <label htmlFor="raceSrcbook" className="category-name">
        {" "}
        From:{" "}
      </label>
      <select
        name="raceSrcbook"
        id="raceSrcbook"
        value={raceSrcbook}
        onChange={updateRaceSrcbook}
        disabled={raceName === ""}
      >
        <option hidden value={""}>
          Select Sourcebook
        </option>
        {raceSrcbookMissing && (
          <option hidden key={raceSrcbook} value={raceSrcbook}>
            {raceSrcbook}
          </option>
        )}
        {optionsRaceSrcbooks &&
          optionsRaceSrcbooks.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
      </select>
      {raceSrcbookMissing && (
        <img
          src={process.env.PUBLIC_URL + "/icons/danger.png"}
          alt="Sourcebook not found"
          className="hover-icon"
          title="This sourcebook wasn't found in the available list. If you change it, it will be lost."
        ></img>
      )}
      {raceFeaturesDisplay}
    </>
  );

  const subraceMissing =
    optionsSubraces &&
    !optionsSubraces.includes(subraceName) &&
    subraceName !== "";
  const subraceSrcbookMissing =
    optionsSubraceSrcbooks &&
    !optionsSubraceSrcbooks.includes(subraceSrcbook) &&
    subraceSrcbook !== "";

  const subraceSection = (
    <>
      <label htmlFor="subrace" className="category-name">
        Subrace:{" "}
      </label>
      <select
        name="subrace"
        id="subrace"
        value={subraceName}
        onChange={updateSubrace}
        disabled={raceSrcbook === ""}
      >
        <option hidden value={""}>
          Select Subrace
        </option>
        {subraceMissing && (
          <option hidden key={subraceName} value={subraceName}>
            {subraceName}
          </option>
        )}
        {optionsSubraces &&
          optionsSubraces.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
      </select>
      {subraceMissing && (
        <img
          src={process.env.PUBLIC_URL + "/icons/danger.png"}
          alt="Subrace not found"
          className="hover-icon"
          title="This subrace wasn't found in the available list. If you change it, it will be lost."
        ></img>
      )}
      <label htmlFor="subraceSrcbook" className="category-name">
        {" "}
        From:{" "}
      </label>
      <select
        name="subraceSrcbook"
        id="subraceSrcbook"
        value={subraceSrcbook}
        onChange={updateSubraceSrcbook}
        disabled={subraceName === ""}
      >
        <option hidden value={""}>
          Select Sourcebook
        </option>
        {subraceSrcbookMissing && (
          <option hidden key={subraceSrcbook} value={subraceSrcbook}>
            {subraceSrcbook}
          </option>
        )}
        {optionsSubraceSrcbooks &&
          optionsSubraceSrcbooks.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
      </select>
      {subraceSrcbookMissing && (
        <img
          src={process.env.PUBLIC_URL + "/icons/danger.png"}
          alt="Sourcebook not found"
          className="hover-icon"
          title="This sourcebook wasn't found in the available list. If you change it, it will be lost."
        ></img>
      )}
      {subraceFeaturesDisplay}
    </>
  );

  const body =
    raceSection && subraceSection ? (
      <>
        {raceSection}
        {subraceSection}
      </>
    ) : (
      <p>Loading...</p>
    );

  const footer = (
    <>
      <button onClick={closeModal}>Cancel</button>
      <button
        onClick={() => {
          character.setRace(
            { name: raceName, src: raceSrcbook },
            { name: subraceName, src: subraceSrcbook },
            [raceFeatureList, subraceFeatureList]
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
      closeModal={closeModal}
      header={header}
      body={body}
      footer={footer}
      category={"race"}
      closeOnOutsideClick={false}
    />
  );
};

export default RaceModal;
