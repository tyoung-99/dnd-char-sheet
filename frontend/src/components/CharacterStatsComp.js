// Character's ability scores, saves, skills, other proficiencies, languages, and speeds
import { useState, useEffect } from "react";
import "../styling/CharacterStatsComp.css";

const CharacterStatsComp = ({ character }) => {
  const [profBonus, setProfBonus] = useState(2);
  const [skills, setSkills] = useState([]);
  const [saves, setSaves] = useState([]);
  const [abilityScores, setAbilityScores] = useState([]);
  const [weaponProfs, setWeaponProfs] = useState([]);
  const [armorProfs, setArmorProfs] = useState([]);
  const [passivePerception, setPassivePerception] = useState(10);

  useEffect(() => {
    const handleSkillsSavesAbilities = (character) => {
      // Skills is array of objects to allow alphabetizing, others are arrays of HTML elements
      let skills = [];
      let saves = [];
      const abilityScores = character.stats.map((ability) => {
        const abilityModifier = Math.floor((ability.score - 10) / 2);

        // Handle saves/skills at same time as abilities for conciseness
        const saveModifier =
          abilityModifier + (ability.saveProf ? profBonus : 0);
        saves.push(
          <p key={ability.name}>
            {ability.saveProf ? (
              <span className="proficient"></span>
            ) : (
              <span className="not-proficient"></span>
            )}{" "}
            {(saveModifier >= 0 ? "+" : "") + saveModifier} {ability.name}
          </p>
        );

        skills = skills.concat(
          ability.skillProfs.map((skill) => ({
            name: skill.name,
            profType: skill.proficiency,
            skillModifier: abilityModifier + skill.proficiency * profBonus,
            abilityName: ability.name,
          }))
        );

        return (
          <p key={ability.name}>
            {ability.name}: {ability.score} (
            {(abilityModifier >= 0 ? "+" : "") + abilityModifier})
          </p>
        );
      });

      skills.sort((first, second) =>
        first.name > second.name ? 1 : first.name === second.name ? 0 : -1
      );

      skills = skills.map((skill) => (
        <p key={skill.name}>
          {skill.profType === 1 ? (
            <span className="proficient"></span>
          ) : skill.profType === 2 ? (
            <span className="expert"></span>
          ) : (
            <span className="not-proficient"></span>
          )}{" "}
          {(skill.skillModifier >= 0 ? "+" : "") + skill.skillModifier}{" "}
          {skill.name} ({skill.abilityName})
        </p>
      ));

      return [skills, saves, abilityScores];
    };

    const handleWeapons = (character) => {
      // Reversed order b/c when inserting into list of profs, order gets reversed again
      const WEAPON_PROF_GROUPS = [
        {
          name: "Martial",
          profs: [
            "Battleaxes",
            "Double-bladed Scimitars",
            "Flails",
            "Glaives",
            "Greataxes",
            "Greatswords",
            "Halberds",
            "Lances",
            "Longswords",
            "Mauls",
            "Morningstars",
            "Pikes",
            "Rapiers",
            "Scimitars",
            "Shortswords",
            "Tridents",
            "War Picks",
            "Warhammers",
            "Whips",
            "Blowguns",
            "Hand Crossbows",
            "Heavy Crossbows",
            "Longbows",
            "Nets",
          ],
        },
        {
          name: "Simple",
          profs: [
            "Clubs",
            "Daggers",
            "Greatclubs",
            "Handaxes",
            "Javelins",
            "Light Hammers",
            "Maces",
            "Quarterstaffs",
            "Sickles",
            "Spears",
            "Yklwas",
            "Light Crossbows",
            "Darts",
            "Shortbows",
            "Slings",
          ],
        },
      ];

      let weaponProfs = [...character.weaponProfs];
      WEAPON_PROF_GROUPS.forEach((group) => {
        if (group.profs.every((prof) => weaponProfs.includes(prof))) {
          weaponProfs.unshift(group.name);
          weaponProfs = weaponProfs.filter(
            (prof) => !group.profs.includes(prof)
          );
        }
      });

      return weaponProfs;
    };

    const handleArmor = (character) => {
      // Reversed order b/c when inserting into list of profs, order gets reversed again
      const ARMOR_PROF_GROUPS = [
        {
          name: "Heavy",
          profs: ["Ring Mail", "Chain Mail", "Splint", "Plate"],
        },
        {
          name: "Medium",
          profs: [
            "Hide",
            "Chain Shirt",
            "Scale Mail",
            "Breastplate",
            "Half Plate",
            "Spiked Armor",
          ],
        },
        { name: "Light", profs: ["Padded", "Leather", "Studded Leather"] },
      ];

      let armorProfs = [...character.armorProfs];
      ARMOR_PROF_GROUPS.forEach((group) => {
        if (group.profs.every((prof) => armorProfs.includes(prof))) {
          armorProfs.unshift(group.name);
          armorProfs = armorProfs.filter((prof) => !group.profs.includes(prof));
        }
      });

      return armorProfs;
    };

    const newProfBonus =
      Math.ceil(
        character.classes.reduce(
          (totalLevel, charClass) => totalLevel + charClass.classLevel,
          0
        ) / 4
      ) + 1;
    setProfBonus(newProfBonus);

    let newSkillsSavesAbilities = handleSkillsSavesAbilities(character);
    setSkills(newSkillsSavesAbilities[0]);
    setSaves(newSkillsSavesAbilities[1]);
    setAbilityScores(newSkillsSavesAbilities[2]);

    let newWeapons = handleWeapons(character);
    setWeaponProfs(newWeapons);

    let newArmor = handleArmor(character);
    setArmorProfs(newArmor);

    const wis = character.stats.find((stat) => stat.name === "WIS");
    const perception = wis.skillProfs.find(
      (skill) => skill.name === "Perception"
    );
    setPassivePerception(
      10 + Math.floor((wis.score - 10) / 2) + perception.proficiency * profBonus
    );
  }, [character, profBonus]);

  return (
    <>
      <div className="col-1 row-flex">
        <div className="col-1_2 col-flex">
          <div className="grid-tile">
            <h1>Ability Scores</h1>
            <div>{abilityScores}</div>
          </div>
          <div className="grid-tile">
            <h1>Saving Throws</h1>
            <div>{saves}</div>
          </div>
          <div className="grid-tile col-end">
            <h1>Other Proficiencies</h1>
            <h2>Weapons</h2>
            <p>{weaponProfs.join(", ")}</p>
            <h2>Armor</h2>
            <p>{armorProfs.join(", ")}</p>
            <h2>Tools</h2>
            <p>{character.toolProfs.join(", ")}</p>
            <h1>Languages</h1>
            <p>{character.languages.join(", ")}</p>
          </div>
        </div>
        <div className="col-1_2 col-flex">
          <div className="grid-tile">
            <h1>Proficiency Bonus: +{profBonus}</h1>
          </div>
          <div className="grid-tile">
            <h1>Passive Perception: {passivePerception}</h1>
          </div>
          <div className="grid-tile">
            <h1>Speed</h1>
            <div className="row-flex">
              <p className="col-1_3">Walk {character.speed.walk} ft</p>
              <p className="col-1_3">Swim {character.speed.swim} ft</p>
              <p className="col-1_3">Fly {character.speed.fly} ft</p>
            </div>
          </div>
          <div className="grid-tile col-end">
            <h1>Skills</h1>
            <div>{skills}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CharacterStatsComp;
