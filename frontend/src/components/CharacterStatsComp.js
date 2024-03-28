// Character's ability scores, saves, skills, other proficiencies, languages, and speeds[0]

import { useState, useEffect, useRef } from "react";
import AbilityScoresModal from "./modals/AbilityScoresModal";
import SkillsSavingThrowsModal from "./modals/SkillsSavingThrowsModal";
import GenericBreakdownModal from "./modals/GenericBreakdownModal";
import SpeedModal from "./modals/SpeedModal";
import "../styling/components/CharacterStatsComp.css";

const CharacterStatsComp = ({
  character,
  charChangeFlag,
  setCharChangeFlag,
  openModal,
  closeModal,
  currentModal,
}) => {
  const dataLoaded = useRef(false);

  const [abilities, setAbilities] = useState();
  const [saves, setSaves] = useState();
  const [skills, setSkills] = useState();
  const [speeds, setSpeeds] = useState();
  const [passivePerception, setPassivePerception] = useState();

  useEffect(() => {
    const newAbilities = character.getAbilities().map((ability) => (
      <p key={ability.name}>
        {ability.name}: {ability.score} (
        {(ability.mod >= 0 ? "+" : "") + ability.mod})
      </p>
    ));
    setAbilities(newAbilities);

    const newSaves = character.getSaves().map((save) => (
      <p key={save.name}>
        {save.prof ? (
          <span className="proficient" title="Proficient"></span>
        ) : (
          <span className="not-proficient" title="Unproficient"></span>
        )}{" "}
        {(save.mod.flat >= 0 ? "+" : "") + save.mod.flat} {save.name}
      </p>
    ));
    setSaves(newSaves);

    const newSkills = character.getSkills().map((skill) => (
      <p key={skill.name}>
        {skill.prof === 1 ? (
          <span className="proficient" title="Proficient"></span>
        ) : skill.prof === 2 ? (
          <span className="expert" title="Expert"></span>
        ) : (
          <span className="not-proficient" title="Unproficient"></span>
        )}{" "}
        {(skill.mod.flat >= 0 ? "+" : "") + skill.mod.flat}{" "}
        {skill.mod.dice.reduce(
          (fullString, die) => fullString + ` + ${die.number}d${die.sides}`,
          ""
        )}{" "}
        {skill.name} ({skill.ability})
        {skill.error ? (
          <img
            src={process.env.PUBLIC_URL + "/icons/danger.png"}
            alt={skill.error}
            className="hover-icon"
            title={skill.error}
          ></img>
        ) : null}
      </p>
    ));
    setSkills(newSkills);

    setSpeeds(character.getSpeeds());
    setPassivePerception(character.getPassivePerception());

    dataLoaded.current = true;
  }, [character, charChangeFlag]);

  if (!dataLoaded.current) return;

  return (
    <>
      <div className="col-1 row-flex">
        <div className="col-1_2 col-flex">
          <div className="grid-tile">
            <h1
              className="clickable"
              onClick={(e) => openModal(e, "abilityScores")}
            >
              Ability Scores
            </h1>
            {currentModal === "abilityScores" && (
              <AbilityScoresModal
                character={character}
                setCharChangeFlag={setCharChangeFlag}
                closeModal={closeModal}
              />
            )}
            <div>{abilities}</div>
          </div>
          <div className="grid-tile">
            <h1
              className="clickable"
              onClick={(e) => openModal(e, "savingThrows")}
            >
              Saving Throws
            </h1>
            {currentModal === "savingThrows" && (
              <SkillsSavingThrowsModal
                character={character}
                setCharChangeFlag={setCharChangeFlag}
                closeModal={closeModal}
                isSkills={false}
              />
            )}
            <div>{saves}</div>
          </div>
          <div className="grid-tile col-end">
            <h1>Other Proficiencies</h1>
            <h2>Weapons</h2>
            <p>{character.getWeaponProfs().join(", ")}</p>
            <h2>Armor</h2>
            <p>{character.getArmorProfs().join(", ")}</p>
            <h2>Tools</h2>
            <p>{character.getToolProfs().join(", ")}</p>
            <h1>Languages</h1>
            <p>{character.getLanguages().join(", ")}</p>
          </div>
        </div>
        <div className="col-1_2 col-flex">
          <div className="grid-tile">
            <h1>Proficiency Bonus: +{character.getProfBonus()}</h1>
          </div>
          <div className="grid-tile">
            <h1
              className="clickable"
              onClick={(e) => openModal(e, "passivePerception[0]")}
            >
              Passive Perception: {passivePerception[0]}
            </h1>
            {currentModal === "passivePerception[0]" && (
              <GenericBreakdownModal
                title={"Passive Perception"}
                closeModal={closeModal}
                breakdown={passivePerception[1]}
                total={passivePerception[0]}
              />
            )}
          </div>
          <div className="grid-tile">
            <h1 className="clickable" onClick={(e) => openModal(e, "speed")}>
              Speed
            </h1>
            {currentModal === "speed" && (
              <SpeedModal
                closeModal={closeModal}
                setCharChangeFlag={setCharChangeFlag}
                breakdown={speeds[1]}
                total={speeds[0]}
              />
            )}
            <div className="row-flex">
              <p className="col-1_3">Walk {speeds[0].walk} ft</p>
              <p className="col-1_3">Swim {speeds[0].swim} ft</p>
              <p className="col-1_3">Fly {speeds[0].fly} ft</p>
            </div>
          </div>
          <div className="grid-tile col-end">
            <h1
              className="clickable"
              onClick={(e) => openModal(e, "skillProficiencies")}
            >
              Skills
            </h1>
            {currentModal === "skillProficiencies" && (
              <SkillsSavingThrowsModal
                character={character}
                setCharChangeFlag={setCharChangeFlag}
                closeModal={closeModal}
                isSkills={true}
              />
            )}
            <div>{skills}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CharacterStatsComp;
