// Displays circles representing death saves, filled if rolled

import { useState } from "react";

const DeathSavesComp = ({ character }) => {
  // Faster to keep track of state than to get from character every time
  const [successCount, setSuccessCount] = useState(
    character.deathSaves.successes
  );
  const [failCount, setFailCount] = useState(character.deathSaves.failures);

  let successes = [],
    failures = [];

  for (let i = 0; i < 3; ++i) {
    successes.push(
      <input
        key={"success " + i}
        type="checkbox"
        checked={i < successCount}
        onChange={(event) => {
          let newCount;
          if (event.target.checked) newCount = successCount + 1;
          else newCount = successCount - 1;
          setSuccessCount(newCount);
          character.setDeathSaves(newCount, failCount);
        }}
      ></input>
    );

    failures.push(
      <input
        key={"failure " + i}
        type="checkbox"
        checked={i < failCount}
        onChange={(event) => {
          let newCount;
          if (event.target.checked) newCount = failCount + 1;
          else newCount = failCount - 1;
          setFailCount(newCount);
          character.setDeathSaves(successCount, newCount);
        }}
      ></input>
    );
  }

  return (
    <div>
      <p>Death Saves</p>
      <p>Successes: {successes}</p>
      <p>Failures: {failures}</p>
    </div>
  );
};

export default DeathSavesComp;
