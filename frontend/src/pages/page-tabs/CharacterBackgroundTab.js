// Character's background details/backstory

const CharacterBackgroundTab = ({ character }) => {
  const background = (
    <>
      <h1 className="header-override">
        Background: {character.background.name}
      </h1>
      <h1>Personality Traits</h1>
      {character.background.personalityTraits.map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
      <h1>Ideals</h1>
      {character.background.ideals.map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
      <h1>Bonds</h1>
      {character.background.bonds.map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
      <h1>Flaws</h1>
      {character.background.flaws.map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
    </>
  );

  const appearance = (
    <>
      <h1 className="header-override">Appearance</h1>
      <div className="row-flex">
        <div className="col-3">
          <h1>Age</h1>
          <p>{character.appearance.age}</p>
        </div>
        <div className="col-3">
          <h1>Height</h1>
          <p>{character.appearance.height}</p>
        </div>
        <div className="col-3">
          <h1>Weight</h1>
          <p>{character.appearance.weight}</p>
        </div>
      </div>
      <div className="row-flex">
        <div className="col-3">
          <h1>Eyes</h1>
          <p>{character.appearance.eyes}</p>
        </div>
        <div className="col-3">
          <h1>Skin</h1>
          <p>{character.appearance.skin}</p>
        </div>
        <div className="col-3">
          <h1>Hair</h1>
          <p>{character.appearance.hair}</p>
        </div>
      </div>
      <h1>Description</h1>
      {character.appearance.desc.map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
    </>
  );

  const allies = (
    <>
      <h1 className="header-override">Allies & Organizations</h1>
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
      <h1 className="header-override">Backstory</h1>
      {character.backstory.map((paragraph, i) => (
        <p key={i} className="text-block">
          {paragraph}
        </p>
      ))}
    </>
  );

  return (
    <>
      <div className="row-flex">
        <div className="col-3 grid-tile">{background}</div>
        <div className="col-3 grid-tile">{appearance}</div>
        <div className="col-3 grid-tile">{allies}</div>
      </div>
      <div className="row-flex">
        <div className="col-1 grid-tile">{backstory}</div>
      </div>
    </>
  );
};

export default CharacterBackgroundTab;
