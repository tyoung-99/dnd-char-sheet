// Input component for skill proficiency racial features

const RaceFeatureSkillProfComp = ({
  featureId,
  category,
  choices,
  featureChoices,
  setFeatureChoices,
  existingProfs,
}) => {
  const SKILL_LIST = [
    "Acrobatics",
    "Animal Handling",
    "Arcana",
    "Athletics",
    "Deception",
    "History",
    "Insight",
    "Intimidation",
    "Investigation",
    "Medicine",
    "Nature",
    "Perception",
    "Performance",
    "Persuasion",
    "Religion",
    "Sleight of Hand",
    "Stealth",
    "Survival",
  ];

  const checkIfUnproficient = (skill) => {
    return existingProfs.find(
      (checkSkill) => checkSkill.name === skill && checkSkill.prof === 0
    );
  };

  let options = choices[1].filter(checkIfUnproficient);
  if (options.length === 0) {
    options = SKILL_LIST.filter(checkIfUnproficient);
  }

  let inputs = [];
  for (let i = 0; i < choices[0]; i++) {
    inputs.push(
      <select
        key={i}
        id={`SkillProf ${i}`}
        name={`SkillProf ${i}`}
        value={featureChoices[featureId][category][i]}
        onChange={(event) => {
          const newChoices = { ...featureChoices };
          newChoices[featureId][category][i] = event.target.value;
          setFeatureChoices(newChoices);
        }}
      >
        <option hidden value={""}>
          Select a skill
        </option>
        {options.map((skill) => {
          // Prevent duplicate selections to avoid need for error checking
          if (
            featureChoices[featureId][category].includes(skill) &&
            featureChoices[featureId][category][i] !== skill
          ) {
            return null;
          }
          return (
            <option key={skill} value={skill}>
              {skill}
            </option>
          );
        })}
      </select>
    );
  }

  return (
    <>
      <label>Skill proficienc{inputs.length > 1 ? "ies" : "y"}:</label>
      {inputs}
    </>
  );
};

export default RaceFeatureSkillProfComp;