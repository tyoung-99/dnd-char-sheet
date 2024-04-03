// Input component for language features

const FeatureLanguageComp = ({
  featureType,
  featureId,
  category,
  choices,
  featureChoices,
  setFeatureChoices,
  onChangeCallBack = (newChoices) => {},
}) => {
  let inputs = [];
  for (let i = 0; i < choices; i++) {
    if (i >= featureChoices[featureType][featureId][category].length) break;
    inputs.push(
      <input
        key={i}
        id={`Language ${i}`}
        name={`Language ${i}`}
        type="text"
        value={featureChoices[featureType][featureId][category][i] || ""}
        onChange={(event) => {
          const newChoices = { ...featureChoices };
          newChoices[featureType][featureId][category][i] = event.target.value;
          setFeatureChoices(newChoices);
          onChangeCallBack(newChoices);
        }}
      ></input>
    );
  }

  return (
    <>
      <label>Known language{inputs.length > 1 ? "s" : ""}: </label>
      {inputs}
    </>
  );
};

export default FeatureLanguageComp;
