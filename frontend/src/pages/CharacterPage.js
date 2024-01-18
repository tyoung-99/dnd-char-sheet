// Full character sheet

import "../styling/CharacterPage.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  const { characterID } = useParams();
  const [character, setCharacter] = useState();

  useEffect(() => {
    const loadCharacter = async () => {
      const response = await axios.get(`/api/characters/${characterID}`);

      setCharacter(response.data);
    };

    loadCharacter();
  }, [characterID]);

  const [activeTab, setActiveTab] = useState("main");

  if (!character) {
    return <div>Loading...</div>;
  }
  const currentHD = character.hitDice.remaining.map(
    (die) => `${die.number}d${die.faces}`
  );
  const totalHD = character.hitDice.total.map(
    (die) => `${die.number}d${die.faces}`
  );

  return (
    <div>
      <div className="name-header">
        <h1>{character.name}</h1>
        <h2>{character.player}</h2>
        <p>{character.alignment}</p>
        <p>
          {character.race.name}{" "}
          {character.race.subrace !== null ? `(${character.race.subrace})` : ""}
        </p>
        <InlineClassListComp classes={character.classes} />
      </div>
      <div className="xp-inspire-header">
        <div>XP: {character.xp}</div>
        <div>Inspiration: {character.inspiration ? "Yes" : "No"}</div>
      </div>
      <div className="combat-header">
        <div>
          <p>AC: {character.armorClass}</p>
          <p>
            Initiative:{" "}
            {(character.initiative >= 0 ? "+" : "") + character.initiative}
          </p>
        </div>
        <div>
          <p>Temp HP: {character.hp.temp}</p>
          <p>Current HP: {character.hp.current}</p>
          <p>Max HP: {character.hp.max}</p>
        </div>
        <div>
          <p>Current Hit Dice: {currentHD.join(", ")}</p>
          <p>Total Hit Dice: {totalHD.join(", ")}</p>
        </div>
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
