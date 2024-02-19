// Character's racial/class/background features, plus feats

const CharacterAbilitiesTab = ({ character }) => {
  let fromClass = character.getFeatures({ fromClass: true });
  let fromOther = character.getFeatures({
    fromRace: true,
    fromSubrace: true,
    fromFeat: true,
    fromBackground: true,
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
        {ability.background || ability.race || ability.subrace || ability.feat}
      </h2>
      <h1>{ability.name}</h1>
      {ability.desc.map((paragraph, j) => (
        <p key={j}>{paragraph}</p>
      ))}
    </div>
  ));

  return (
    <div className="grid-container row-flex">
      <div className="col-1_2 grid-tile">{fromClass}</div>
      <div className="col-1_2 grid-tile">{fromOther}</div>
    </div>
  );
};

export default CharacterAbilitiesTab;
