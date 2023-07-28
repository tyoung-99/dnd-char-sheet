// Displays circles representing death saves, filled if rolled
const DeathSavesComp = ({ deathSaves }) => {
  let successes = [],
    failures = [];

  for (let i = 0; i < 3; ++i) {
    successes.push(
      deathSaves.successes > i ? (
        <span key={"success " + i} className="death-save-marker filled"></span>
      ) : (
        <span key={"success " + i} className="death-save-marker"></span>
      )
    );

    failures.push(
      deathSaves.failures > i ? (
        <span key={"failure " + i} className="death-save-marker filled"></span>
      ) : (
        <span key={"failure " + i} className="death-save-marker"></span>
      )
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
