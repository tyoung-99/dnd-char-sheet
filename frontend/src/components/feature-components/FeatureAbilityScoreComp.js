// Input component for ability score increase racial features

const FeatureAbilityScoreComp = ({
  featureType,
  featureId,
  category,
  choices,
  featureChoices,
  setFeatureChoices,
  currentAbilityScores,
}) => {
  const pointsLeft =
    choices.pointsAvailable -
    featureChoices[featureType][featureId][category].reduce(
      (pointsUsed, ability) => pointsUsed + ability.amount,
      0
    );

  return (
    <>
      <label>Points Available: {pointsLeft}</label>
      <ul className="ability-scores">
        {featureChoices[featureType][featureId][category].map((ability, i) => {
          if (
            choices.options.length > 0 &&
            !choices.options.includes(ability.ability)
          ) {
            return null;
          }

          return (
            <li key={ability.ability}>
              <span>{ability.ability}</span>
              <span>
                {ability.amount}
                <div className="button-holder">
                  <button
                    className={
                      pointsLeft <= 0 ||
                      ability.amount >= choices.maxInOne ||
                      currentAbilityScores.find(
                        (checkAbility) => checkAbility.name === ability.ability
                      ).score +
                        ability.amount >=
                        ability.cap
                        ? "hidden"
                        : ""
                    }
                    onClick={() => {
                      const newChoices = { ...featureChoices };
                      newChoices[featureType][featureId][category][i].amount =
                        ability.amount + 1;
                      setFeatureChoices(newChoices);
                    }}
                  >
                    +
                  </button>
                  <button
                    className={
                      pointsLeft >= choices.pointsAvailable ||
                      ability.amount <= 0
                        ? "hidden"
                        : ""
                    }
                    onClick={() => {
                      const newChoices = { ...featureChoices };
                      newChoices[featureType][featureId][category][i].amount =
                        ability.amount - 1;
                      setFeatureChoices(newChoices);
                    }}
                  >
                    -
                  </button>
                </div>
              </span>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default FeatureAbilityScoreComp;
