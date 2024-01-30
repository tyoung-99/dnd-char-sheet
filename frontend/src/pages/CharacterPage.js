// Full character sheet

import "../styling/CharacterPage.css";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import TabNavComp from "../components/TabNavComp";
import InlineClassListComp from "../components/InlineClassListComp";
import TabContentComp from "../components/TabContentComp";
import CharacterMainTab from "./page-tabs/CharacterMainTab";
import CharacterBackgroundTab from "./page-tabs/CharacterBackgroundTab";
import CharacterAbilitiesTab from "./page-tabs/CharacterAbilitiesTab";
import CharacterInventoryTab from "./page-tabs/CharacterInventoryTab";
import CharacterSpellcastingTab from "./page-tabs/CharacterSpellcastingTab";
import DeathSavesComp from "../components/DeathSavesComp";

const CharacterPage = () => {
  const [activeTab, setActiveTab] = useState("main");

  const { characterID } = useParams();
  const [character, setCharacter] = useState();
  const [initiative, setInitiative] = useState();
  const [currentHitDice, setCurrentHitDice] = useState();
  const [totalHitDice, setTotalHitDice] = useState();

  useEffect(() => {
    const loadCharacter = async () => {
      const response = await axios.get(`/api/characters/${characterID}`);

      setCharacter(response.data);
    };

    loadCharacter();
  }, [characterID]);

  useEffect(() => {
    if (!character) {
      return;
    }

    setInitiative(
      Math.floor(
        (character.stats.find((stat) => stat.name === "DEX").score - 10) / 2
      )
    );

    // Leave totals as parseable array at 1st so current can be calculated
    let newTotal = [];
    character.classes.forEach((charClass) => {
      let index = newTotal.findIndex((die) => die.faces === charClass.hitDie);
      if (index === -1) {
        newTotal.push({
          number: charClass.classLevel,
          faces: charClass.hitDie,
        });
      } else {
        newTotal[index].number += charClass.classLevel;
      }
    });

    setCurrentHitDice(
      character.usedHitDice.map(
        (usedDie) =>
          `${
            newTotal.find((totalDie) => totalDie.faces === usedDie.faces)
              .number - usedDie.number
          }d${usedDie.faces}`
      )
    );
    newTotal = newTotal.map((die) => `${die.number}d${die.faces}`);
    setTotalHitDice(newTotal);
  }, [character]);

  if (!character) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="menu-bar">
        <Link to="/">
          <input
            type="button"
            id="charListLink"
            name="charListLink"
            value="< Back to List"
          ></input>
        </Link>
      </div>
      <div className="name-header">
        <img
          src={process.env.PUBLIC_URL + `/img/${character.avatarSrc}`}
          alt="Avatar"
          className="avatar"
        ></img>
        <div className="avatar-label">
          <h1>{character.name} </h1>
          <h2>{character.player}</h2>
          <p>{character.alignment}</p>
          <p>
            {character.race.name}{" "}
            {character.race.subrace !== null
              ? `(${character.race.subrace})`
              : ""}
          </p>
          <InlineClassListComp classes={character.classes} />
        </div>
      </div>
      <div className="xp-inspire-header">
        <div>XP: {character.xp}</div>
        <div>Inspiration: {character.inspiration ? "Yes" : "No"}</div>
      </div>
      <div className="combat-header">
        <div>
          <p>AC: {character.armorClass}</p>
          <p>Initiative: {(initiative >= 0 ? "+" : "") + initiative}</p>
        </div>
        <div>
          <p>Max HP: {character.hp.max}</p>
          <p>Current HP: {character.hp.current}</p>
          <p>Temp HP: {character.hp.temp}</p>
        </div>
        {!(totalHitDice && currentHitDice) ? (
          <p>Loading...</p>
        ) : (
          <div>
            <p>Total Hit Dice: {totalHitDice.join(", ")}</p>
            <p>Current Hit Dice: {currentHitDice.join(", ")}</p>
          </div>
        )}

        <DeathSavesComp deathSaves={character.deathSaves} />
      </div>
      <ul className="nav">
        <TabNavComp
          id={"main"}
          tabName={"Main"}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <TabNavComp
          id={"background"}
          tabName={"Background/Appearance"}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <TabNavComp
          id={"abilities"}
          tabName={"Abilities"}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <TabNavComp
          id={"inventory"}
          tabName={"Inventory"}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <TabNavComp
          id={"spellcasting"}
          tabName={"Spellcasting"}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </ul>
      <div>
        <TabContentComp id={"main"} activeTab={activeTab}>
          <CharacterMainTab character={character} />
        </TabContentComp>
        <TabContentComp id={"background"} activeTab={activeTab}>
          <CharacterBackgroundTab character={character} />
        </TabContentComp>
        <TabContentComp id={"abilities"} activeTab={activeTab}>
          <CharacterAbilitiesTab character={character} />
        </TabContentComp>
        <TabContentComp id={"inventory"} activeTab={activeTab}>
          <CharacterInventoryTab character={character} />
        </TabContentComp>
        <TabContentComp id={"spellcasting"} activeTab={activeTab}>
          <CharacterSpellcastingTab character={character} />
        </TabContentComp>
      </div>
    </div>
  );
};
export default CharacterPage;
