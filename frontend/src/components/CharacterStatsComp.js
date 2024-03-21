// Character's ability scores, saves, skills, other proficiencies, languages, and speeds

import AbilityScoresModal from "./modals/AbilityScoresModal";
import SkillsSavingThrowsModal from "./modals/SkillsSavingThrowsModal";
import GenericBreakdownModal from "./modals/GenericBreakdownModal";
import SpeedModal from "./modals/SpeedModal";
import "../styling/components/CharacterStatsComp.css";

const CharacterStatsComp = ({
  character,
  openModal,
  closeModal,
  currentModal,
}) => {
  const abilities = character.getAbilities().map((ability) => (
    <p key={ability.name}>
      {ability.name}: {ability.score} (
      {(ability.mod >= 0 ? "+" : "") + ability.mod})
    </p>
  ));

  const saves = character.getSaves().map((save) => (
    <p key={save.name}>
      {save.prof ? (
        <span className="proficient" title="Proficient"></span>
      ) : (
        <span className="not-proficient" title="Unproficient"></span>
      )}{" "}
      {(save.mod.flat >= 0 ? "+" : "") + save.mod.flat} {save.name}
    </p>
  ));

  const skills = character.getSkills().map((skill) => (
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

  const [speeds, speedsBreakdown] = character.getSpeeds();
  const [passivePerception, passivePerceptionBreakdown] =
    character.getPassivePerception();

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
              onClick={(e) => openModal(e, "passivePerception")}
            >
              Passive Perception: {passivePerception}
            </h1>
            {currentModal === "passivePerception" && (
              <GenericBreakdownModal
                title={"Passive Perception"}
                closeModal={closeModal}
                breakdown={passivePerceptionBreakdown}
                total={passivePerception}
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
                breakdown={speedsBreakdown}
                total={speeds}
              />
            )}
            <div className="row-flex">
              <p className="col-1_3">Walk {speeds.walk} ft</p>
              <p className="col-1_3">Swim {speeds.swim} ft</p>
              <p className="col-1_3">Fly {speeds.fly} ft</p>
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
