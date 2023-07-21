// Full character sheet

import "../styling/CharacterPage.css";
import { useState } from "react";
import { useParams } from "react-router-dom";
import TabNavComp from "../components/TabNavComp";
import InlineClassListComp from "../components/InlineClassListComp";
import CharacterStatsTab from "./page-tabs/CharacterStatsTab";
import CharacterBackgroundTab from "./page-tabs/CharacterBackgroundTab";
import TabContentComp from "../components/TabContentComp";
import characters from "../sample-data/CharactersContentSample";

const CharacterPage = () => {
  const { characterID } = useParams();
  const character = characters.find(
    (character) => character.id === parseInt(characterID)
  );

  const [activeTab, setActiveTab] = useState("stats");

  return (
    <div>
      <h1 className="character-name">{character.name}</h1>
      <InlineClassListComp classes={character.classes} />
      <div className="common-header">
        <p>AC: {character.armor_class}</p>
        <p>Initiative: {character.initiative}</p>
        <p>Temp HP: {character.hp.temp}</p>
        <p>Current HP: {character.hp.current}</p>
        <p>Max HP: {character.hp.max}</p>
      </div>
      <ul className="nav">
        <TabNavComp
          id={"stats"}
          tabName={"Stats"}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <TabNavComp
          id={"background"}
          tabName={"Background"}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </ul>
      <div className="outlet">
        <TabContentComp id={"stats"} activeTab={activeTab}>
          <CharacterStatsTab character={character} />
        </TabContentComp>
        <TabContentComp id={"background"} activeTab={activeTab}>
          <CharacterBackgroundTab character={character} />
        </TabContentComp>
      </div>
    </div>
  );
};
export default CharacterPage;
