// Character's racial/class/background features, plus feats

const CharacterAbilitiesTab = ({ character }) => {
  let fromClass = [];
  let fromOther = [];

  character.abilities.forEach((ability) => {
    if (ability.class) {
      fromClass.push(ability);
    } else {
      fromOther.push(ability);
    }
  });

  fromClass = fromClass.map((ability, i) => (
    <div key={i}>
      <h2 className="float-right">{ability.class}</h2>
      <h1>{ability.name}</h1>
      {ability.desc.map((paragraph, j) => (
        <p key={j}>{paragraph}</p>
      ))}
    </div>
  ));
  fromOther = fromOther.map((ability, i) => (
    <div key={i}>
      <h2 className="float-right">
        {ability.background || ability.race || ability.feat}
      </h2>
      <h1>{ability.name}</h1>
      {ability.desc.map((paragraph, j) => (
        <p key={j}>{paragraph}</p>
      ))}
    </div>
  ));

  return (
    <div className="grid-container row-flex">
      <div className="col-2 grid-tile">{fromClass}</div>
      <div className="col-2 grid-tile">{fromOther}</div>
    </div>
  );
};

export default CharacterAbilitiesTab;
