// Input component for tool proficiency features

import { useEffect, useState } from "react";
import axios from "axios";

const FeatureToolProfComp = ({
  featureType,
  featureId,
  category,
  choices,
  featureChoices,
  setFeatureChoices,
  onChangeCallBack = (newChoices) => {},
  originalFeatureChoices,
  existingProfs,
  isBackground,
}) => {
  const [toolOptions, setToolOptions] = useState();

  useEffect(() => {
    const loadData = async () => {
      let newToolOptions = [];
      if (choices[1].length > 0) {
        for (const type of choices[1]) {
          newToolOptions = newToolOptions.concat(
            (await axios.get(`/api/proficiencies/tools/${type}`)).data
          );
        }
      } else {
        (await axios.get(`/api/proficiencies/tools/all`)).data.forEach(
          (type) => {
            newToolOptions = newToolOptions.concat(type.profs);
          }
        );
      }

      newToolOptions = newToolOptions.sort();

      newToolOptions = newToolOptions.filter((tool) => {
        // Considers tool profs previously selected for this feature as unproficient to allow them to be displayed in dropdown if deselected
        return (
          !existingProfs.includes(tool) ||
          originalFeatureChoices[featureType][featureId][category].includes(
            tool
          )
        );
      });

      setToolOptions(newToolOptions);
    };

    loadData();
  }, [
    category,
    choices,
    existingProfs,
    featureId,
    featureType,
    originalFeatureChoices,
  ]);

  if (!toolOptions) return "Loading...";

  let inputs = [];
  for (let i = 0; i < choices[0]; i++) {
    if (i >= featureChoices[featureType][featureId][category].length) break;
    inputs.push(
      <select
        key={i}
        id={`ToolProf ${i}`}
        name={`ToolProf ${i}`}
        value={featureChoices[featureType][featureId][category][i]}
        onChange={(event) => {
          const newChoices = { ...featureChoices };
          newChoices[featureType][featureId][category][i] = event.target.value;
          setFeatureChoices(newChoices);
          onChangeCallBack(newChoices);
        }}
      >
        {/* Tool dropdowns in background section need to include empty option b/c deselection is necessary */}
        <option hidden={!isBackground} value={""}>
          Select a tool
        </option>
        {toolOptions.map((tool) => {
          // Prevent duplicate selections to avoid need for error checking
          if (
            featureChoices[featureType][featureId][category].includes(tool) &&
            featureChoices[featureType][featureId][category][i] !== tool
          ) {
            return null;
          }
          return (
            <option key={tool} value={tool}>
              {tool}
            </option>
          );
        })}
      </select>
    );
  }

  return (
    <>
      <label>Tool proficienc{inputs.length > 1 ? "ies" : "y"}: </label>
      {inputs}
    </>
  );
};

export default FeatureToolProfComp;
