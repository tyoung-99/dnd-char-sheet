// Character's spells/spell slots

import "../../styling/pages/page-tabs/CharacterSpellcastingTab.css";
import SpellModal from "../../components/modals/SpellModal";
import { useState } from "react";

const CharacterSpellcastingTab = ({ character }) => {
  const spellsPreparedCounts = character.getSpellsPreparedCounts();
  const castClasses = character.spellcasting.sources.map((castSrc) => {
    const srcName = castSrc.class || castSrc.other;
    const spellAttackBonus = character.getSpellAttackBonus(srcName);
    return (
      <div key={srcName} className="col-flex col-1_2 data-grid">
        <div className="row-flex col-1">
          <h1 className="col-1_2 data-cell">{srcName}</h1>
          <h1 className="col-1_2 data-cell">
            Spellcasting Ability: {castSrc.ability}
          </h1>
        </div>
        <div className="row-flex col-1">
          <h1 className="col-1_2 data-cell">
            Spell Save DC: {character.getSpellSaveDC(srcName)}
          </h1>
          <h1 className="col-1_2 data-cell">
            Spell Attack Bonus: {spellAttackBonus > 0 ? "+" : null}
            {spellAttackBonus}
          </h1>
        </div>
        <div className="row-flex col-1">
          {!(srcName in spellsPreparedCounts) ? null : (
            <>
              <h1 className="col-1_2 data-cell">
                Max Spells Prepared: {spellsPreparedCounts[srcName].maxPrepped}
              </h1>
              <h1 className="col-1_2 data-cell">
                Current Spells Prepared:{" "}
                {spellsPreparedCounts[srcName].currentPrepped || 0}
              </h1>
            </>
          )}
        </div>
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

  const [currentModal, setCurrentModal] = useState("");

  const openModal = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const modal = event.target.dataset.modal;
    if (modal) {
      setCurrentModal(modal);
    }
  };

  const closeModal = () => {
    setCurrentModal("");
  };

  const spellsKnown = character.getSpellsKnown();
  spellsKnown.forEach((level) => {
    level.forEach((spell, i) => {
      const key =
        spell.name +
        " " +
        (spell.class || spell.race || spell.background || spell.feat);
      level[i] = (
        <div key={key} className="spell-entry">
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
            <label
              htmlFor={"prep " + key}
              className="spell-label"
              data-modal={key}
              onClick={openModal}
            >
              {spell.name}
            </label>
          </div>
          {spell.hoverIcons.map((icon) => (
            <img
              key={icon[1]}
              src={process.env.PUBLIC_URL + `/icons/${icon[0]}`}
              alt={icon[1]}
              className="hover-icon"
              title={icon[1]}
              data-modal={key}
              onClick={openModal}
            ></img>
          ))}
          <SpellModal
            spell={spell}
            character={character}
            closeModal={closeModal}
            isOpen={currentModal === key}
          />
        </div>
      );
    });
  });

  return (
    <div className="grid-container row-flex">
      <div className="col-flex col-1">
        <div className="row-flex">
          <div className="grid-tile col-6_10">
            <div className="row-flex cast-classes col-end">{castClasses}</div>
          </div>
          <div className="grid-tile col-4_10">{concentration}</div>
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
