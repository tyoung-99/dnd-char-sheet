// Character's ability scores, saves, skills, other proficiencies, languages, and speeds
import "../styling/CharacterStatsComp.css";

const CharacterStatsComp = ({ character }) => {
  const abilities = character.getAbilities().map((ability) => (
    <p key={ability.name}>
      {ability.name}: {ability.score} (
      {(ability.mod >= 0 ? "+" : "") + ability.mod})
    </p>
  ));

  const saves = character.getSaves().map((save) => (
    <p key={save.name}>
      {save.prof ? (
        <span className="proficient"></span>
      ) : (
        <span className="not-proficient"></span>
      )}{" "}
      {(save.mod >= 0 ? "+" : "") + save.mod} {save.name}
    </p>
  ));

  const skills = character.getSkills().map((skill) => (
    <p key={skill.name}>
      {skill.prof === 1 ? (
        <span className="proficient"></span>
      ) : skill.prof === 2 ? (
        <span className="expert"></span>
      ) : (
        <span className="not-proficient"></span>
      )}{" "}
      {(skill.mod >= 0 ? "+" : "") + skill.mod} {skill.name} ({skill.ability})
    </p>
  ));

  return (
    <>
      <div className="col-1 row-flex">
        <div className="col-1_2 col-flex">
          <div className="grid-tile">
            <h1>Ability Scores</h1>
            <div>{abilities}</div>
          </div>
          <div className="grid-tile">
            <h1>Saving Throws</h1>
            <div>{saves}</div>
          </div>
          <div className="grid-tile col-end">
            <h1>Other Proficiencies</h1>
            <h2>Weapons</h2>
            <p>{character.getWeaponProfs().join(", ")}</p>
            <h2>Armor</h2>
            <p>{character.getArmorProfs().join(", ")}</p>
            <h2>Tools</h2>
            <p>{character.toolProfs.join(", ")}</p>
            <h1>Languages</h1>
            <p>{character.languages.join(", ")}</p>
          </div>
        </div>
        <div className="col-1_2 col-flex">
          <div className="grid-tile">
            <h1>Proficiency Bonus: +{character.getProfBonus()}</h1>
          </div>
          <div className="grid-tile">
            <h1>Passive Perception: {character.getPassivePerception()}</h1>
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
