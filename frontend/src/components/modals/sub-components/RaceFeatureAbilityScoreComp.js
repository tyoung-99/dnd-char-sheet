// Input component for ability score increase racial features

const RaceFeatureAbilityScoreComp = ({
  featureId,
  category,
  choices,
  featureChoices,
  setFeatureChoices,
}) => {
  const pointsLeft =
    choices.pointsAvailable -
    featureChoices[featureId][category].reduce(
      (pointsUsed, ability) => pointsUsed + ability.amount,
      0
    );

  return (
    <>
      <label>Points Available: {pointsLeft}</label>
      <ul className="ability-scores">
        {featureChoices[featureId][category].map((ability, i) => (
          <li key={ability.ability}>
            <span>{ability.ability}</span>
            <span>
              {ability.amount}
              <div className="button-holder">
                <button
                  className={
                    pointsLeft <= 0 || ability.amount >= choices.maxInOne
                      ? "hidden"
                      : ""
                  }
                  onClick={() => {
                    const newChoices = { ...featureChoices };
                    newChoices[featureId][category][i].amount =
                      ability.amount + 1;
                    setFeatureChoices(newChoices);
                  }}
                >
                  +
                </button>
                <button
                  className={
                    pointsLeft >= choices.pointsAvailable || ability.amount <= 0
                      ? "hidden"
                      : ""
                  }
                  onClick={() => {
                    const newChoices = { ...featureChoices };
                    newChoices[featureId][category][i].amount =
                      ability.amount - 1;
                    setFeatureChoices(newChoices);
                  }}
                >
                  -
                </button>
              </div>
            </span>
          </li>
        ))}
      </ul>
    </>
  );
};

export default RaceFeatureAbilityScoreComp;
