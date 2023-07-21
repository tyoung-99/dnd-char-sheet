// Character's stats/general combat abilities

const CharacterMainTab = ({ character }) => {
  // Skills is array of objects to allow alphabetizing, others are arrays of HTML elements
  let skills = [];
  let saves = [];
  const abilityScores = character.stats.map((ability) => {
    const abilityModifier = Math.floor((ability.score - 10) / 2);

    const saveModifier =
      abilityModifier + (ability.save_prof ? character.prof_bonus : 0);
    saves.push(
      <p key={ability.name}>
        {ability.save_prof ? "[P] " : "[-] "}
        {(saveModifier >= 0 ? "+" : "") + saveModifier} {ability.name}
      </p>
    );

    skills = skills.concat(
      ability.skill_profs.map((skill) => ({
        name: skill.name,
        prof_type: skill.proficiency,
        skillModifier:
          abilityModifier + skill.proficiency * character.prof_bonus,
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

  const skillsDisplay = skills.map((skill) => (
    <p key={skill.name}>
      {skill.prof_type === 1 ? "[P] " : skill.prof_type === 2 ? "[E] " : "[-] "}
      {(skill.skillModifier >= 0 ? "+" : "") + skill.skillModifier} {skill.name}{" "}
      ({skill.abilityName})
    </p>
  ));

  return (
    <>
      <div className="char-sheet-tile">
        <h2>Ability Scores</h2>
        {abilityScores}
      </div>
      <div className="char-sheet-tile">
        <h2>Saving Throws</h2>
        {saves}
      </div>
      <div className="char-sheet-tile">
        <h2>Skills</h2>
        {skillsDisplay}
      </div>
      <div className="char-sheet-tile">
        <h2>Passive Wisdom (Perception): {character.passive_perception}</h2>
      </div>
      <div className="char-sheet-tile">
        <h2>Other Proficiencies</h2>
        <h3>Weapons</h3>
        <p>{character.weapon_profs.join(", ")}</p>
        <h3>Armor</h3>
        <p>{character.armor_profs.join(", ")}</p>
        <h3>Tools</h3>
        <p>{character.tool_profs.join(", ")}</p>
        <h2>Languages</h2>
        <p>{character.languages.join(", ")}</p>
      </div>
      <div className="char-sheet-tile">
        <h2>Speed</h2>
        <p>Walk {character.speed.walk} ft</p>
        <p>Swim {character.speed.swim} ft</p>
        <p>Fly {character.speed.fly} ft</p>
      </div>
    </>
  );
};

export default CharacterMainTab;
