import LanguageEffectComp from "./featureEffectsComponents/LanguageEffectComp";
import Collapsible from "../Collapsible";

const EditFeatureEffectsComp = ({ effects, setEffects }) => {
  const addEffect = (category) => {
    setEffects([
      ...effects,
      {
        category: category,
        changes: { required: null, choices: null },
      },
    ]);
  };

  const deleteEffect = (index) => {
    setEffects((prevEffects) =>
      prevEffects.filter((effects, i) => i !== index)
    );
  };

  return (
    <>
      <div className="row-flex">
        <select
          onChange={(e) => {
            addEffect(e.target.value);
            e.target.value = "";
          }}
        >
          <option value="" selected disabled hidden>
            Add Effect
          </option>
          {categoryOptions
            .filter(
              (category) =>
                !effects.some((effect) => effect.category === category)
            )
            .map((optionName, index) => (
              <option key={index} value={optionName}>
                {optionName}
              </option>
            ))}
        </select>
      </div>
      {effects.map((effect, index) => (
        <>
          <div className="row-flex">
            <Collapsible title={effect.category}>
              {getComponentByCategory(effect, setEffects)}
            </Collapsible>
            <div>
              <button
                className="row-flex delete-button"
                onClick={() => deleteEffect(index)}
              >
                Delete
              </button>
            </div>
          </div>
        </>
      ))}
    </>
  );
};

// update options as new components are added
const categoryOptions = [
  "Language",
  "AbilityScore",
  "SkillProficiency",
  "Feat",
];

const getComponentByCategory = (effect, setEffects) => {
  switch (effect.category) {
    case "Language":
      return <LanguageEffectComp effect={effect} setEffects={setEffects} />;
    case "AbilityScore":
      return "AbilityScore component";
    case "SkillProficiency":
      return "SkillProficiency component";
    case "Feat":
      return "Feat component";
    default:
      return "";
  }
};

export default EditFeatureEffectsComp;
