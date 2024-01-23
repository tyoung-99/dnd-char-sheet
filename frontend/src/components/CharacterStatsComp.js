// Character's ability scores, saves, skills
import "../styling/CharacterStatsComp.css";

const CharacterStatsComp = ({ character }) => {
  // Skills is array of objects to allow alphabetizing, others are arrays of HTML elements
  let skills = [];
  let saves = [];
  const abilityScores = character.stats.map((ability) => {
    const abilityModifier = Math.floor((ability.score - 10) / 2);

    // Handle saves/skills at same time as abilities for conciseness
    const saveModifier =
      abilityModifier + (ability.saveProf ? character.profBonus : 0);
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
        skillModifier:
          abilityModifier + skill.proficiency * character.profBonus,
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
      {(skill.skillModifier >= 0 ? "+" : "") + skill.skillModifier} {skill.name}{" "}
      ({skill.abilityName})
    </p>
  ));

  return (
    <>
      <div className="col-12 row-flex">
        <div className="col-6 col-flex">
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
            <p>{character.weaponProfs.join(", ")}</p>
            <h2>Armor</h2>
            <p>{character.armorProfs.join(", ")}</p>
            <h2>Tools</h2>
            <p>{character.toolProfs.join(", ")}</p>
            <h1>Languages</h1>
            <p>{character.languages.join(", ")}</p>
          </div>
        </div>
        <div className="col-6 col-flex">
          <div className="grid-tile">
            <h1>Proficiency Bonus: {character.profBonus}</h1>
          </div>
          <div className="grid-tile">
            <h1>Passive Perception: {character.passivePerception}</h1>
          </div>
          <div className="grid-tile">
            <h1>Speed</h1>
            <div className="row-flex">
              <p className="col-4">Walk {character.speed.walk} ft</p>
              <p className="col-4">Swim {character.speed.swim} ft</p>
              <p className="col-4">Fly {character.speed.fly} ft</p>
            </div>
          </div>
          <div className="grid-tile">
            <h1>Skills</h1>
            <div>{skills}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CharacterStatsComp;
