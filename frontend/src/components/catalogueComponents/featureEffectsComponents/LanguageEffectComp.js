import { useState } from "react";

const LanguageEffectComp = ({ effect, setEffects }) => {
  const [requiredLang, setRequiredLang] = useState(
    effect.changes.required ? effect.changes.required.join(", ") : ""
  );
  const [choiceNums, setChoiceNums] = useState(
    effect.changes.choices ? effect.changes.choices : 0
  );

  return (
    <>
      <div className="row-flex">
        <div className="col-1_2">
          <h4>Required</h4>
          <textarea
            className="almost-full-width no-resize"
            rows="3"
            defaultValue={requiredLang}
            placeholder="Languages, seperated, by, commas, and, spaces"
            onBlur={(e) => {
              const langs = e.target.value;
              setRequiredLang(langs);
              effect.changes.required = langs.split(", ");
              setEffects((prevEffects) => {
                const updatedEffects = prevEffects.map((curr) =>
                  curr.category === effect.category ? effect : curr
                );
                return updatedEffects;
              });
            }}
          ></textarea>
        </div>
        <div className="col-1_2">
          <h4>Language Choices</h4>
          <input
            className="effects-choices"
            type="number"
            value={choiceNums}
            onChange={(e) => {
              setChoiceNums(e.target.value);
              effect.changes.choices = e.target.value;
              setEffects((prevEffects) => {
                const updatedEffects = prevEffects.map((curr) =>
                  curr.category === effect.category ? effect : curr
                );
                return updatedEffects;
              });
            }}
          />
        </div>
      </div>
    </>
  );
};

export default LanguageEffectComp;
