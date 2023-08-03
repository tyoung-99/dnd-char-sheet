// Character's ability scores and proficiencies
import "../../../styling/AbilityScoresProficiencies.css";
import { useState, useEffect } from "react";

const AbilityScoresProficiencies = ({ character, saveCharacter }) => {
  // Save occurs here to ensure useStates took effect
  useEffect(() => {
    saveCharacter();
  });

  // Ability scores/modifiers
  const defaultModifiers = {};
  character.stats.forEach((ability) => {
    defaultModifiers[ability.name] = Math.floor((ability.score - 10) / 2);
  });

  const [abilityModifiers, setAbilityModifiers] = useState(defaultModifiers);

  const updateModifiers = (event) => {
    const newModifiers = { ...abilityModifiers };
    newModifiers[event.target.getAttribute("data-ability")] = Math.floor(
      (event.target.value - 10) / 2
    );
    setAbilityModifiers(newModifiers);
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
                  data-section={"stats"}
                  data-type={"score"}
                  data-ability={ability.name}
                  onChange={updateModifiers}
                ></input>
              </div>
            </div>
            <div className="col-6 col-flex">
              <p>
                Modifier: {abilityModifiers[ability.name] >= 0 ? "+" : ""}
                {abilityModifiers[ability.name]}
              </p>
            </div>
          </div>
          {ability.skill_profs.length === 0 ? null : (
            <div className="grid-container row-flex">
              <div className="col-12 col-flex">
                <div className="grid-container row-flex">
                  <div className="col-8 col-flex">
                    <h2>Skill</h2>
                  </div>
                  <div className="col-4 col-flex">
                    <h2>Proficiency</h2>
                  </div>
                </div>
                {ability.skill_profs.map((skill) => (
                  <div className="grid-container row-flex" key={skill.name}>
                    <div className="col-8 col-flex">
                      <p>{skill.name}</p>
                    </div>
                    <div className="col-4 col-flex skill-button-div">
                      <input
                        type="button"
                        data-section={"stats"}
                        data-type={"skill"}
                        data-ability={ability.name}
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
                  </div>
                ))}
              </div>
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

  const [timer, setTimer] = useState(null);

  const updateWeapons = (event) => {
    // Only updates 500 ms after user finishes typing
    clearTimeout(timer);
    const newTimer = setTimeout(
      (event) => {
        const newWeaponProfs = [...weaponProfs];
        const weaponField = event.target;
        const updatedIndex = newWeaponProfs.findIndex(
          (weapon) => weapon === weaponField.defaultValue
        );
        const newWeapon = weaponField.value;

        if (updatedIndex >= 0) {
          newWeaponProfs[updatedIndex] = newWeapon;
          console.log(weaponField.defaultValue);
        }

        setWeaponProfs(newWeaponProfs);
        console.log(newWeaponProfs);
      },
      500,
      event
    );
    setTimer(newTimer);
  };

  const addWeapon = () => {
    const newWeaponProfs = [...weaponProfs];
    newWeaponProfs.push("");
    setWeaponProfs(newWeaponProfs);
  };

  const removeWeapon = () => {
    console.log("remove");
  };

  const updateArmor = () => {
    console.log("armor");
  };

  const updateTools = () => {
    console.log("tools");
  };

  const updateLanguages = () => {
    console.log("languages");
  };

  const otherProfsSection = (
    <div className="grid-tile">
      <h1>Other Proficiencies</h1>
      <div className="grid-container row-flex">
        <div className="col-3 col-flex">
          <div className="grid-tile borderless">
            <h2>Weapons</h2>
            {weaponProfs.map((weapon, i) => (
              <div key={i}>
                <input
                  type="text"
                  defaultValue={weapon}
                  data-section={"other-profs"}
                  data-type={"weapon-prof"}
                  data-weapon={weapon}
                  onChange={updateWeapons}
                ></input>
                <button onClick={removeWeapon}>x</button>
              </div>
            ))}
            <input type="text" className="placeholder-textbox"></input>
            <button onClick={addWeapon}>+</button>
          </div>
        </div>
        <div className="col-3 col-flex">
          <div className="grid-tile borderless">
            <h2>Armor</h2>
            {armorProfs.map((armor) => (
              <input
                key={armor}
                type="text"
                defaultValue={armor}
                data-section={"other-profs"}
                data-type={"armor-prof"}
                data-armor={armor}
                onChange={updateArmor}
              ></input>
            ))}
            <input
              type="text"
              placeholder="Add Armor"
              data-section={"other-profs"}
              data-type={"armor-prof"}
              onChange={updateArmor}
            ></input>
          </div>
        </div>
        <div className="col-3 col-flex">
          <div className="grid-tile borderless">
            <h2>Tools</h2>
            {toolProfs.map((tool) => (
              <input
                key={tool}
                type="text"
                defaultValue={tool}
                data-section={"other-profs"}
                data-type={"tool-prof"}
                data-tool={tool}
                onChange={updateTools}
              ></input>
            ))}
            <input
              type="text"
              placeholder="Add Tool"
              data-section={"other-profs"}
              data-type={"tool-prof"}
              onChange={updateTools}
            ></input>
          </div>
        </div>
        <div className="col-3 col-flex">
          <div className="grid-tile borderless">
            <h2>Languages</h2>
            {languages.map((language) => (
              <input
                key={language}
                type="text"
                defaultValue={language}
                data-section={"other-profs"}
                data-type={"language"}
                data-language={language}
                onChange={updateLanguages}
              ></input>
            ))}
            <input
              type="text"
              placeholder="Add Language"
              data-section={"other-profs"}
              data-type={"language"}
              onChange={updateLanguages}
            ></input>
          </div>
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
