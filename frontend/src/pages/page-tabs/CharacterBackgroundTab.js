// Character's background details/backstory

const CharacterBackgroundTab = ({ character }) => {
  const background = (
    <>
      <h1>Background: {character.background.name}</h1>
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
    </>
  );

  const appearance = (
    <>
      <h1>Appearance</h1>
      <div className="row-flex">
        <div className="col-1_3">
          <h2>Age</h2>
          <p>{character.appearance.age}</p>
        </div>
        <div className="col-1_3">
          <h2>Height</h2>
          <p>{character.appearance.height}</p>
        </div>
        <div className="col-1_3">
          <h2>Weight</h2>
          <p>{character.appearance.weight}</p>
        </div>
      </div>
      <div className="row-flex">
        <div className="col-1_3">
          <h2>Eyes</h2>
          <p>{character.appearance.eyes}</p>
        </div>
        <div className="col-1_3">
          <h2>Skin</h2>
          <p>{character.appearance.skin}</p>
        </div>
        <div className="col-1_3">
          <h2>Hair</h2>
          <p>{character.appearance.hair}</p>
        </div>
      </div>
      <h2>Description</h2>
      {character.appearance.desc.map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
    </>
  );

  const allies = (
    <>
      <h1>Allies & Organizations</h1>
      <img
        src={process.env.PUBLIC_URL + `/img/${character.symbolSrc}`}
        alt="Symbol"
        className="height-8 float-right"
      ></img>
      {character.allies.map((paragraph, i) => (
        <p key={i} className="text-block col-1">
          {paragraph}
        </p>
      ))}
    </>
  );

  const backstory = (
    <>
      <h1>Backstory</h1>
      {character.backstory.map((paragraph, i) => (
        <p key={i} className="text-block">
          {paragraph}
        </p>
      ))}
    </>
  );

  return (
    <div className="grid-container row-flex">
      <div className="col-flex">
        <div className="row-flex">
          <div className="col-1_3 grid-tile">{background}</div>
          <div className="col-1_3 grid-tile">{appearance}</div>
          <div className="col-1_3 grid-tile">{allies}</div>
        </div>
        <div className="row-flex">
          <div className="col-1 grid-tile">{backstory}</div>
        </div>
      </div>
    </div>
  );
};

export default CharacterBackgroundTab;
