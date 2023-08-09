// Character's ability scores and proficiencies
import "../../../styling/AbilityScoresProficiencies.css";
import { useState } from "react";

const AbilityScoresProficiencies = ({ character, updateCharacter }) => {
  // Ability scores/modifiers
  const defaultScores = {};
  character.stats.forEach((ability) => {
    defaultScores[ability.name] = ability.score;
  });

  const [abilityScores, setAbilityScores] = useState(defaultScores);

  const updateScores = (event) => {
    const newScores = { ...abilityScores };
    newScores[event.target.getAttribute("data-ability")] = event.target.value;
    setAbilityScores(newScores);
    updateCharacter({ ability_scores: newScores });
  };

  // Skill proficiencies
  const defaultSkillProfs = {};
  character.stats.forEach((ability) => {
    ability.skill_profs.forEach((skill) => {
      defaultSkillProfs[skill.name] = skill.proficiency;
    });
  });

  const [skillProfs, setSkillProfs] = useState(defaultSkillProfs);

  const updateSkills = (event) => {
    const newSkills = { ...skillProfs };
    const changedSkill = event.target.getAttribute("data-skill");

    newSkills[changedSkill]++;
    if (newSkills[changedSkill] > 2) {
      newSkills[changedSkill] = 0;
    }

    setSkillProfs(newSkills);
    updateCharacter({ skill_profs: newSkills });
  };

  // HTML for ability scores/modifiers, skill profs
  const abilitiesSection = character.stats.map((ability) => {
    return (
      <div className="col-2 col-flex" key={ability.name}>
        <div className="grid-tile ability-column">
          <h1>{ability.name_long}</h1>
          <div className="grid-container row-flex">
            <div className="col-6 col-flex ability-line">
              <div>
                <label htmlFor={ability.name}>Score: </label>
                <input
                  className="ability-input"
                  type="text"
                  name={ability.name}
                  defaultValue={ability.score}
                  data-ability={ability.name}
                  onChange={updateScores}
                ></input>
              </div>
            </div>
            <div className="col-6 col-flex">
              <p>
                Modifier:{" "}
                {Math.floor((abilityScores[ability.name] - 10) / 2) >= 0
                  ? "+"
                  : ""}
                {Math.floor((abilityScores[ability.name] - 10) / 2)}
              </p>
            </div>
          </div>
          {ability.skill_profs.length === 0 ? null : (
            <div className="grid-container row-flex">
              <ul className="col-12 col-flex">
                <li className="grid-container row-flex">
                  <div className="col-8 col-flex">
                    <h2>Skill</h2>
                  </div>
                  <div className="col-4 col-flex">
                    <h2>Proficiency</h2>
                  </div>
                </li>
                {ability.skill_profs.map((skill) => (
                  <li className="grid-container row-flex" key={skill.name}>
                    <div className="col-8 col-flex">
                      <p>{skill.name}</p>
                    </div>
                    <div className="col-4 col-flex">
                      <input
                        type="button"
                        data-skill={skill.name}
                        value={
                          skillProfs[skill.name] === 0
                            ? "None"
                            : skillProfs[skill.name] === 1
                            ? "Proficient"
                            : "Expert"
                        }
                        onClick={updateSkills}
                      ></input>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  });

  // Other proficiencies
  const [weaponProfs, setWeaponProfs] = useState(character.weapon_profs);
  const [armorProfs, setArmorProfs] = useState(character.armor_profs);
  const [toolProfs, setToolProfs] = useState(character.tool_profs);
  const [languages, setLanguages] = useState(character.languages);

  const updateOtherProfs = (event, type) => {
    let newProfs;
    switch (type) {
      case "weapon":
        newProfs = [...weaponProfs];
        break;
      case "armor":
        newProfs = [...armorProfs];
        break;
      case "tool":
        newProfs = [...toolProfs];
        break;
      case "language":
        newProfs = [...languages];
        break;
      default:
        return;
    }

    const inputField = event.target;
    const updatedIndex = inputField.id;
    const newProf = inputField.value;

    newProfs[updatedIndex] = newProf;

    switch (type) {
      case "weapon":
        setWeaponProfs(newProfs);
        updateCharacter({ weapon_profs: newProfs });
        break;
      case "armor":
        setArmorProfs(newProfs);
        updateCharacter({ armor_profs: newProfs });
        break;
      case "tool":
        setToolProfs(newProfs);
        updateCharacter({ tool_profs: newProfs });
        break;
      case "language":
        setLanguages(newProfs);
        updateCharacter({ languages: newProfs });
        break;
      default:
        break;
    }
  };

  const addOtherProf = (type) => {
    let newProfs;
    switch (type) {
      case "weapon":
        newProfs = [...weaponProfs];
        newProfs.push("");
        setWeaponProfs(newProfs);
        updateCharacter({ weapon_profs: newProfs });
        break;
      case "armor":
        newProfs = [...armorProfs];
        newProfs.push("");
        setArmorProfs(newProfs);
        updateCharacter({ armor_profs: newProfs });
        break;
      case "tool":
        newProfs = [...toolProfs];
        newProfs.push("");
        setToolProfs(newProfs);
        updateCharacter({ tool_profs: newProfs });
        break;
      case "language":
        newProfs = [...languages];
        newProfs.push("");
        setLanguages(newProfs);
        updateCharacter({ languages: newProfs });
        break;
      default:
        return;
    }
  };

  const removeOtherProf = (event, type) => {
    let newProfs;
    const removedIndex = event.target.id;
    switch (type) {
      case "weapon":
        newProfs = [...weaponProfs];
        newProfs.splice(removedIndex, 1);
        setWeaponProfs(newProfs);
        updateCharacter({ weapon_profs: newProfs });
        break;
      case "armor":
        newProfs = [...armorProfs];
        newProfs.splice(removedIndex, 1);
        setArmorProfs(newProfs);
        updateCharacter({ armor_profs: newProfs });
        break;
      case "tool":
        newProfs = [...toolProfs];
        newProfs.splice(removedIndex, 1);
        setToolProfs(newProfs);
        updateCharacter({ tool_profs: newProfs });
        break;
      case "language":
        newProfs = [...languages];
        newProfs.splice(removedIndex, 1);
        setLanguages(newProfs);
        updateCharacter({ languages: newProfs });
        break;
      default:
        return;
    }
  };

  const otherProfsSection = (
    <div className="grid-tile other-profs">
      <h1>Other Proficiencies</h1>
      <div className="grid-container row-flex">
        <div className="col-3 col-flex">
          <ul className="grid-tile borderless">
            <li>
              <h2>Weapons</h2>
            </li>
            {weaponProfs.map((weapon, i) => {
              return (
                <li key={i}>
                  <input
                    className="col-11"
                    type="text"
                    id={i}
                    value={weapon}
                    onChange={(event) => {
                      updateOtherProfs(event, "weapon");
                    }}
                  ></input>
                  <button
                    className="col-1"
                    id={i}
                    onClick={(event) => {
                      removeOtherProf(event, "weapon");
                    }}
                  >
                    x
                  </button>
                </li>
              );
            })}
            <li>
              <button
                className="col-12"
                onClick={() => {
                  addOtherProf("weapon");
                }}
              >
                +
              </button>
            </li>
          </ul>
        </div>
        <div className="col-3 col-flex">
          <ul className="grid-tile borderless">
            <li>
              <h2>Armor</h2>
            </li>
            {armorProfs.map((armor, i) => {
              return (
                <li key={i}>
                  <input
                    className="col-11"
                    type="text"
                    id={i}
                    value={armor}
                    onChange={(event) => {
                      updateOtherProfs(event, "armor");
                    }}
                  ></input>
                  <button
                    className="col-1"
                    id={i}
                    onClick={(event) => {
                      removeOtherProf(event, "armor");
                    }}
                  >
                    x
                  </button>
                </li>
              );
            })}
            <li>
              <button
                className="col-12"
                onClick={() => {
                  addOtherProf("armor");
                }}
              >
                +
              </button>
            </li>
          </ul>
        </div>
        <div className="col-3 col-flex">
          <ul className="grid-tile borderless">
            <li>
              <h2>Tools</h2>
            </li>
            {toolProfs.map((tool, i) => {
              return (
                <li key={i}>
                  <input
                    className="col-11"
                    type="text"
                    id={i}
                    value={tool}
                    onChange={(event) => {
                      updateOtherProfs(event, "tool");
                    }}
                  ></input>
                  <button
                    className="col-1"
                    id={i}
                    onClick={(event) => {
                      removeOtherProf(event, "tool");
                    }}
                  >
                    x
                  </button>
                </li>
              );
            })}
            <li>
              <button
                className="col-12"
                onClick={() => {
                  addOtherProf("tool");
                }}
              >
                +
              </button>
            </li>
          </ul>
        </div>
        <div className="col-3 col-flex">
          <ul className="grid-tile borderless">
            <li>
              <h2>Languages</h2>
            </li>
            {languages.map((language, i) => {
              return (
                <li key={i}>
                  <input
                    className="col-11"
                    type="text"
                    id={i}
                    value={language}
                    onChange={(event) => {
                      updateOtherProfs(event, "language");
                    }}
                  ></input>
                  <button
                    className="col-1"
                    id={i}
                    onClick={(event) => {
                      removeOtherProf(event, "language");
                    }}
                  >
                    x
                  </button>
                </li>
              );
            })}
            <li>
              <button
                className="col-12"
                onClick={() => {
                  addOtherProf("language");
                }}
              >
                +
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid-container row-flex">
      <div className="col-12 col-flex">
        <div className="grid-container row-flex">{abilitiesSection}</div>
        {otherProfsSection}
      </div>
    </div>
  );
};

export default AbilityScoresProficiencies;
