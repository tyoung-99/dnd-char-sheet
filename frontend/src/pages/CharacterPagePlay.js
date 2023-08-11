// Version of sheet for use in play
import "../styling/CharacterPagePlay.css";
import { useState } from "react";
import TabNavComp from "../components/TabNavComp";
import TabContentComp from "../components/TabContentComp";
import MainTab from "./page-tabs/play/Main";
import BackgroundTab from "./page-tabs/play/Background";
import AbilitiesTab from "./page-tabs/play/Abilities";
import InventoryTab from "./page-tabs/play/Inventory";
import SpellcastingTab from "./page-tabs/play/Spellcasting";

const CharacterPagePlay = ({ character }) => {
  const [activeTab, setActiveTab] = useState("main");

  const currentHD = character.hit_dice.remaining.map(
    (die) => `${die.number}d${die.faces}`
  );
  const totalHD = character.hit_dice.total.map(
    (die) => `${die.number}d${die.faces}`
  );

  let deathSuccesses = [],
    deathFailures = [];

  for (let i = 0; i < 3; ++i) {
    deathSuccesses.push(
      character.death_saves.successes > i ? (
        <span key={"success " + i} className="death-save-marker filled"></span>
      ) : (
        <span key={"success " + i} className="death-save-marker"></span>
      )
    );

    deathFailures.push(
      character.death_saves.failures > i ? (
        <span key={"failure " + i} className="death-save-marker filled"></span>
      ) : (
        <span key={"failure " + i} className="death-save-marker"></span>
      )
    );
  }

  return (
    <>
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
        <div>
          <p>Death Saves</p>
          <p>Successes: {deathSuccesses}</p>
          <p>Failures: {deathFailures}</p>
        </div>
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
          <MainTab character={character} />
        </TabContentComp>
        <TabContentComp id={"background"} activeTab={activeTab}>
          <BackgroundTab character={character} />
        </TabContentComp>
        <TabContentComp id={"abilities"} activeTab={activeTab}>
          <AbilitiesTab character={character} />
        </TabContentComp>
        <TabContentComp id={"inventory"} activeTab={activeTab}>
          <InventoryTab character={character} />
        </TabContentComp>
        <TabContentComp id={"spellcasting"} activeTab={activeTab}>
          <SpellcastingTab character={character} />
        </TabContentComp>
      </div>
    </>
  );
};
export default CharacterPagePlay;
