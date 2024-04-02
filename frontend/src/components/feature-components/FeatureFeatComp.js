// Input component for feat racial features

import { useEffect, useState } from "react";
import axios from "axios";

const FeatureFeatComp = ({
  featureType,
  featureId,
  category,
  choices,
  featureChoices,
  setFeatureChoices,
  originalFeatureChoices,
  existingFeats,
  addNewEffectChoices,
  getFeatureChoiceInputs,
}) => {
  const [featList, setFeatList] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      let newFeatList;
      if (choices[1].length === 0) {
        newFeatList = (await axios.get(`/api/feats`)).data;
      } else {
        newFeatList = (await axios.get(`/api/feats/multiple/${choices[1]}`))
          .data;
      }

      // Considers feats previously selected for this feature as unknown to allow them to be displayed in dropdown if deselected
      newFeatList = newFeatList.filter(
        (feat) =>
          !existingFeats.find((checkFeat) => checkFeat._id === feat._id) ||
          originalFeatureChoices[featureType][featureId][category].includes(
            feat._id
          )
      );

      setFeatList(newFeatList);
    };

    loadData();
  }, [
    category,
    choices,
    existingFeats,
    featureId,
    featureType,
    originalFeatureChoices,
  ]);

  let inputs = [];
  for (let i = 0; i < choices[0]; i++) {
    const dropdown = (
      <select
        id={`Feat ${i}`}
        name={`Feat ${i}`}
        value={featureChoices[featureType][featureId][category][i]}
        onChange={(event) => {
          const prevChoice =
            featureChoices[featureType][featureId][category][i];

          const newChoices = { ...featureChoices };
          newChoices[featureType][featureId][category][i] = event.target.value;

          const toAdd = [
            featList.find((checkFeat) => checkFeat._id === event.target.value),
          ];

          delete newChoices.feat[prevChoice];
          addNewEffectChoices(toAdd, newChoices.feat);

          setFeatureChoices(newChoices);
        }}
      >
        <option hidden value={""}>
          Select a feat
        </option>
        {featList.map((feat) => {
          // Prevent duplicate selections to avoid need for error checking
          if (
            featureChoices[featureType][featureId][category].includes(
              feat._id
            ) &&
            featureChoices[featureType][featureId][category][i] !== feat._id
          ) {
            return null;
          }
          return (
            <option key={feat._id} value={feat._id}>
              {feat.name}
            </option>
          );
        })}
      </select>
    );

    const currentFeat = featList.find(
      (checkFeat) =>
        checkFeat._id === featureChoices[featureType][featureId][category][i]
    );
    const featOptions = currentFeat ? (
      <>
        {currentFeat.description.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
        {currentFeat.effects.map((effect, i) => (
          <div key={i}>
            {getFeatureChoiceInputs(
              "feat",
              currentFeat._id,
              effect.category,
              effect.changes.choices
            )}
          </div>
        ))}
      </>
    ) : null;

    inputs.push(
      <div key={i}>
        {dropdown}
        {featOptions}
      </div>
    );
  }

  return (
    <>
      <label>Feat{inputs.length > 1 ? "s" : ""}:</label>
      {inputs}
    </>
  );
};

export default FeatureFeatComp;
