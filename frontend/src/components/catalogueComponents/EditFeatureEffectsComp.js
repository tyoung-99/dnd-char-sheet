import { useState } from "react";
import LanguageEffectComp from "./featureEffectsComponents/LanguageEffectComp";
import Collapsible from "../Collapsible";

const EditFeatureEffectsComp = (racialFeature) => {
  const [effects, setEffects] = useState(
    racialFeature.effects ? racialFeature.effects : []
  );

  const addEffect = (category) => {
    setEffects([
      ...effects,
      {
        category: category,
        changes: { required: null, choices: null },
      },
    ]);
  };

  const deleteEffect = () => {
    //tbd
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
          {categoryOptions.map((optionName, index) => (
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
              {getContentsByCategory(effect.category)}
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

const getContentsByCategory = (category) => {
  switch (category) {
    case "Language":
      return <LanguageEffectComp />;
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
