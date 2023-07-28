// Full character sheet

import "../styling/CharacterPage.css";
import { useState } from "react";
import { useParams } from "react-router-dom";
import TabNavComp from "../components/TabNavComp";
import InlineClassListComp from "../components/InlineClassListComp";
import TabContentComp from "../components/TabContentComp";
import CharacterMainTab from "./page-tabs/CharacterMainTab";
import CharacterBackgroundTab from "./page-tabs/CharacterBackgroundTab";
import CharacterAbilitiesTab from "./page-tabs/CharacterAbilitiesTab";
import CharacterInventoryTab from "./page-tabs/CharacterInventoryTab";
import CharacterSpellcastingTab from "./page-tabs/CharacterSpellcastingTab";
import DeathSavesComp from "../components/DeathSavesComp";
import characters from "../sample-data/CharactersContentSample";

const CharacterPage = () => {
  const { characterID } = useParams();
  const character = characters.find(
    (character) => character.id === parseInt(characterID)
  );

  const [activeTab, setActiveTab] = useState("main");

  const currentHD = character.hit_dice.remaining.map(
    (die) => `${die.number}d${die.faces}`
  );
  const totalHD = character.hit_dice.total.map(
    (die) => `${die.number}d${die.faces}`
  );

  return (
    <div>
      <div className="name-header">
        <h1>{character.name}</h1>
        <p>{character.alignment}</p>
        <p>
          {character.race.name}{" "}
          {character.race.subrace !== null ? `(${character.race.subrace})` : ""}
        </p>
        <InlineClassListComp classes={character.classes} />
      </div>
      <div className="xp-header">XP: {character.xp}</div>
      <div className="combat-header">
        <div>
          <p>AC: {character.armor_class}</p>
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
        <DeathSavesComp deathSaves={character.death_saves} />
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
          tabName={"Background"}
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
