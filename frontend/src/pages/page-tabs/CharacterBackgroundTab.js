// Character's background details/backstory

const CharacterBackgroundTab = ({ character }) => {
  return (
    <div className="row-flex">
      <div className="col-4">
        <h1>{character.background.name}</h1>
        <h2>Personality Traits</h2>
        {character.background.personalityTraits.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
        <h2>Ideals</h2>
        {character.background.ideals.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
        <h2>Bonds</h2>
        {character.background.bonds.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
        <h2>Flaws</h2>
        {character.background.flaws.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
      <div className="col-8">
        <h1>Backstory</h1>
        {character.backstory.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
};

export default CharacterBackgroundTab;
