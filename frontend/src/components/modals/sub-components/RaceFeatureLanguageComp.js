// Input component for language racial features

const RaceFeatureLanguageComp = ({
  featureId,
  category,
  choices,
  featureChoices,
  setFeatureChoices,
}) => {
  let inputs = [];
  for (let i = 0; i < choices; i++) {
    inputs.push(
      <input
        key={i}
        id={`Language ${i}`}
        name={`Language ${i}`}
        type="text"
        value={featureChoices.race[featureId][category][i]}
        onChange={(event) => {
          const newChoices = { ...featureChoices };
          newChoices.race[featureId][category][i] = event.target.value;
          setFeatureChoices(newChoices);
        }}
      ></input>
    );
  }

  return (
    <>
      <label>Known language{inputs.length > 1 ? "s" : ""}:</label>
      {inputs}
    </>
  );
};

export default RaceFeatureLanguageComp;
