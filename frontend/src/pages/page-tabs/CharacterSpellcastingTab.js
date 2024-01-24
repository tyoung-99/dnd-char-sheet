// Character's spells/spell slots

import "../../styling/CharacterSpellcastingTab.css";

const CharacterSpellcastingTab = ({ character }) => {
  const castClasses = character.spellcasting.classes.map((castClass) => (
    <div key={castClass.name} className="row-flex">
      <h1 className="col-4">{castClass.name}</h1>
      <h1 className="col-4">Spellcasting Ability: {castClass.ability}</h1>
      <h1 className="col-4">Spell Save DC: {castClass.saveDC}</h1>
      <h1 className="col-4">
        Spell Attack Bonus: {castClass.attackBonus > 0 ? "+" : null}
        {castClass.attackBonus}
      </h1>
    </div>
  ));

  const slotsTotal = character.spellcasting.spellSlots.slotsTotal.map(
    (count, i) =>
      i < 5 ? count + character.spellcasting.pactSlots.slotsTotal[i] : count
  );
  const slotsExpended = character.spellcasting.spellSlots.slotsExpended.map(
    (count, i) =>
      i < 5 ? count + character.spellcasting.pactSlots.slotsExpended[i] : count
  );
  const spellHeaders = slotsTotal.map((count, i) => (
    <div key={i + 1} className="col-10 col-flex">
      <div className="grid-tile spell-col">
        <h1>{i + 1}</h1>
        <h2>{count}</h2>
        <h2>{slotsExpended[i]}</h2>
      </div>
    </div>
  ));
  spellHeaders.unshift(
    <div key={0} className="col-10 col-flex">
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

  const spellsKnown = [...Array(10)].map(() => []);
  character.spellcasting.spellsKnown.forEach((spell) => {
    spellsKnown[spell.level].push(spell);
  });
  spellsKnown.forEach((level) => {
    level.sort((first, second) =>
      first.name > second.name ? 1 : first.name === second.name ? 0 : -1
    );
    level.forEach((spell, i) => {
      const hoverIcons = [];
      if (spell.ritual) {
        hoverIcons.push(["ritual.png", "Ritual"]);
      }
      if (spell.components.v) {
        hoverIcons.push(["verbal.png", "Verbal Component"]);
      }
      if (spell.components.s) {
        hoverIcons.push(["somatic.png", "Somatic Component"]);
      }
      if (spell.components.m) {
        hoverIcons.push(["material.png", "Material Component"]);
        if (spell.components.m.some((comp) => comp.value)) {
          hoverIcons.push([
            "gold_cost.png",
            "Material Component with Gold Cost",
          ]);
        }
        if (spell.components.m.some((comp) => comp.consumed)) {
          hoverIcons.push(["consumed.png", "Material Component Consumed"]);
        }
      }
      if (spell.concentration) {
        hoverIcons.push(["concentration.png", "Concentration"]);
      }
      if (spell.background) {
        hoverIcons.push(["background.png", `From ${spell.background}`]);
      }
      if (spell.race) {
        hoverIcons.push(["race.png", `From ${spell.race}`]);
      }
      if (spell.feat) {
        hoverIcons.push(["feat.png", `From ${spell.feat}`]);
      }
      if (spell.class) {
        hoverIcons.push([
          `${spell.class.toLowerCase()}.png`,
          `From ${spell.class}`,
        ]);
      }

      const key =
        spell.name +
        " " +
        (spell.class || spell.race || spell.background || spell.feat);
      level[i] = (
        <div key={key}>
          {spell.level > 0 ? (
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
          {hoverIcons.map((icon) => (
            <img
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
        <div className="grid-tile">{castClasses}</div>
        <div className="row-flex">{spellHeaders}</div>
        <div className="row-flex">
          {spellsKnown.map((level, i) => (
            <div key={i} className="col-10 col-flex">
              <div className="grid-tile spell-col">{level}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CharacterSpellcastingTab;
