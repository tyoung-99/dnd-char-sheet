// Character's spells/spell slots

import "../../styling/CharacterSpellcastingTab.css";

const CharacterSpellcastingTab = ({ character }) => {
  const castClasses = character.spellcasting.sources.map((castSrc) => {
    const srcName = castSrc.class || castSrc.other;
    const spellAttackBonus = character.getSpellAttackBonus(srcName);
    return (
      <div key={srcName} className="row-flex">
        <h1 className="col-1_4">{srcName}</h1>
        <h1 className="col-1_4">Spellcasting Ability: {castSrc.ability}</h1>
        <h1 className="col-1_4">
          Spell Save DC: {character.getSpellSaveDC(srcName)}
        </h1>
        <h1 className="col-1_4">
          Spell Attack Bonus: {spellAttackBonus > 0 ? "+" : null}
          {spellAttackBonus}
        </h1>
      </div>
    );
  });

  const roundsToTime = (rounds) => {
    const CONVERSIONS = [
      [600, "hour"],
      [10, "minute"],
      [1 / 6, "second"],
    ];
    let time = "";

    CONVERSIONS.forEach((pair) => {
      const newTime = Math.floor(rounds / pair[0]);
      if (newTime > 0) {
        time = time.concat(`${newTime} ${pair[1]}${newTime !== 1 ? "s" : ""} `);
      }
      rounds = rounds % pair[0];
    });

    return time;
  };
  const roundsLeft = character.spellcasting.concentration
    ? character.spellcasting.concentration.roundsLeft
    : null;
  const concentration = (
    <>
      <div className="row-flex">
        <h1 className="col-1_2">Current Concentration</h1>
        <h1 className="col-1_2">Time Remaining</h1>
      </div>
      <div className="row-flex">
        {!character.spellcasting.concentration ? (
          <p>-None-</p>
        ) : (
          <>
            <p className="col-1_2">
              {character.spellcasting.concentration.name}
            </p>
            <p className="col-1_2">
              {roundsToTime(roundsLeft)}
              <br></br>({roundsLeft} round
              {roundsLeft !== 1 ? "s" : null})
            </p>
          </>
        )}
      </div>
    </>
  );

  const slotsTotal = character.getTotalSpellSlots();
  const slotsExpended = character.getExpendedSpellSlots();

  const spellHeaders = slotsTotal.map((count, i) => (
    <div key={i + 1} className="col-1_10 col-flex">
      <div className="grid-tile spell-col">
        <h1>{i + 1}</h1>
        <h2>{count}</h2>
        <h2>{slotsExpended[i]}</h2>
      </div>
    </div>
  ));
  spellHeaders.unshift(
    <div key={0} className="col-1_10 col-flex">
      <div className="grid-tile spell-col">
        <h1>Spell Level</h1>
        <h2>Slots Total</h2>
        <h2>Slots Expended</h2>
      </div>
      <div className="grid-tile spell-col">
        <h1>Cantrips</h1>
      </div>
    </div>
  );

  const spellsKnown = character.getSpellsKnown();
  spellsKnown.forEach((level) => {
    level.forEach((spell, i) => {
      const key =
        spell.name +
        " " +
        (spell.class || spell.race || spell.background || spell.feat);
      level[i] = (
        <div key={key}>
          <div>
            {spell.level > 0 && spell.prepared !== 2 ? (
              <input
                type="checkbox"
                id={"prep " + key}
                name={"prep " + key}
                value={"prep " + key}
                defaultChecked={spell.prepared}
              ></input>
            ) : null}
            <label htmlFor={"prep " + key} className="spell">
              {spell.name}
            </label>
          </div>
          {spell.hoverIcons.map((icon) => (
            <img
              key={icon[1]}
              src={process.env.PUBLIC_URL + `/img/hover_icons/${icon[0]}`}
              alt={icon[1]}
              className="hover-icon"
              title={icon[1]}
            ></img>
          ))}
        </div>
      );
    });
  });

  return (
    <div className="grid-container row-flex">
      <div className="col-flex col-1">
        <div className="row-flex">
          <div className="grid-tile col-7_10">{castClasses}</div>
          <div className="grid-tile col-3_10">{concentration}</div>
        </div>
        <div className="row-flex">{spellHeaders}</div>
        <div className="row-flex">
          {spellsKnown.map((level, i) => (
            <div key={i} className="col-1_10 col-flex">
              <div className="grid-tile spell-col">{level}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CharacterSpellcastingTab;
