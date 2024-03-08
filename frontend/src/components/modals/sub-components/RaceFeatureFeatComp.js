// Input component for feat racial features

import { useEffect, useState } from "react";
import axios from "axios";

const RaceFeatureFeatComp = ({
  featureId,
  category,
  choices,
  featureChoices,
  setFeatureChoices,
}) => {
  const [featList, setFeatList] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setFeatList((await axios.get(`/api/feats`)).data);
    };
    loadData();
  }, []);

  let inputs = [];
  for (let i = 0; i < choices[0]; i++) {
    inputs.push(
      <select
        key={i}
        id={`Feat ${i}`}
        name={`Feat ${i}`}
        value={featureChoices.race[featureId][category][i]}
        onChange={(event) => {
          const newChoices = { ...featureChoices };
          newChoices.race[featureId][category][i] = event.target.value;
          setFeatureChoices(newChoices);
        }}
      >
        <option hidden value={""}>
          Select a feat
        </option>
        {featList.map((feat) => {
          // Prevent duplicate selections to avoid need for error checking
          if (
            featureChoices.race[featureId][category].includes(feat._id) &&
            featureChoices.race[featureId][category][i] !== feat._id
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
  }

  return (
    <>
      <label>Feat{inputs.length > 1 ? "s" : ""}:</label>
      {inputs}
    </>
  );
};

export default RaceFeatureFeatComp;
