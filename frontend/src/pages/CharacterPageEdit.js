// Version of sheet for editing stats, abilities, level, etc.
import "../styling/CharacterPageEdit.css";
import { useState } from "react";
import TabNavComp from "../components/TabNavComp";
import TabContentComp from "../components/TabContentComp";
import GeneralTab from "./page-tabs/edit/General";
import AbilityScoresProficienciesTab from "./page-tabs/edit/AbilityScoresProficiencies";
import ClassTab from "./page-tabs/edit/Class";
import FeatsTab from "./page-tabs/edit/Feats";

const CharacterPageEdit = ({ character, saveCharacter }) => {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <>
      <ul className="nav">
        <TabNavComp
          id={"general"}
          tabName={"General"}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <TabNavComp
          id={"ability-scores-proficiencies"}
          tabName={"Ability Scores & Proficiencies"}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <TabNavComp
          id={"class"}
          tabName={"Class"}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <TabNavComp
          id={"feats"}
          tabName={"Feats"}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </ul>
      <div>
        <TabContentComp id={"general"} activeTab={activeTab}>
          <GeneralTab character={character} />
        </TabContentComp>
        <TabContentComp
          id={"ability-scores-proficiencies"}
          activeTab={activeTab}
        >
          <AbilityScoresProficienciesTab
            character={character}
            saveCharacter={saveCharacter}
          />
        </TabContentComp>
        <TabContentComp id={"class"} activeTab={activeTab}>
          <ClassTab character={character} />
        </TabContentComp>
        <TabContentComp id={"feats"} activeTab={activeTab}>
          <FeatsTab character={character} />
        </TabContentComp>
      </div>
    </>
  );
};
export default CharacterPageEdit;
