// Full character sheet

import "../styling/pages/CharacterPage.css";
import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Character from "../Character";
import TabNavComp from "../components/TabNavComp";
import InlineClassListComp from "../components/InlineClassListComp";
import TabContentComp from "../components/TabContentComp";
import CharacterMainTab from "./page-tabs/CharacterMainTab";
import CharacterBackgroundTab from "./page-tabs/CharacterBackgroundTab";
import CharacterFeaturesTab from "./page-tabs/CharacterFeaturesTab";
import CharacterBuffsTab from "./page-tabs/CharacterBuffsTab";
import CharacterEquipmentTab from "./page-tabs/CharacterEquipmentTab";
import CharacterSpellcastingTab from "./page-tabs/CharacterSpellcastingTab";
import DeathSavesComp from "../components/DeathSavesComp";
import XpComp from "../components/XpComp";
import MultiColumnDropdownComp from "../components/MultiColumnDropdownComp";
import RaceModal from "../components/modals/RaceModal";

const CharacterPage = () => {
  const [activeTab, setActiveTab] = useState("main");
  const [currentModal, setCurrentModal] = useState("");

  const { characterID } = useParams();
  const [character, setCharacter] = useState();
  const [avatarURL, setAvatarURL] = useState();
  const [alignmentList, setAlignmentList] = useState();

  const [showingSavedMessage, setShowingSavedMessage] = useState(false);
  const fileInput = useRef(null);

  const [editingCharName, setEditingCharName] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      let response = await axios.get(`/api/characters/${characterID}`);
      const newChar = Object.assign(
        await Character.create(setShowingSavedMessage),
        response.data
      );
      setCharacter(newChar);
      refreshAvatarImg(newChar);

      response = await axios.get("/api/alignments");
      setAlignmentList(response.data);
    };

    loadData();
  }, [characterID]);

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

  const refreshAvatarImg = async (character) => {
    try {
      const imgBlob = await axios.get(`/api/img/char/${character.avatarId}`, {
        responseType: "blob",
      });
      setAvatarURL(URL.createObjectURL(imgBlob.data));
    } catch (error) {} // No need to do anything if there was no image, alt text will display
  };

  const applyNewAvatar = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.put("api/img/char/add", formData, {
      headers: { "content-type": "multipart/form-data" },
    });

    if (character.avatarId !== 0) {
      axios.post(`/api/img/char/${character.avatarId}/remove`);
    }

    character.setAvatar(response.data);
    refreshAvatarImg(character);
  };

  if (!character) {
    return <div>Loading...</div>;
  }

  const inspirationHeader = (
    <div>
      <p>Inspiration:</p>
      <input
        type="button"
        id="toggleInspiration"
        name="toggleInspiration"
        value={character.inspiration ? "Yes" : "No"}
        onClick={() => character.setInspiration(!character.inspiration)}
      ></input>
    </div>
  );

  return (
    <div>
      <div className="menu-bar row-flex">
        <Link to="/">
          <input
            type="button"
            id="charListLink"
            name="charListLink"
            value="< Back to List"
          ></input>
        </Link>
        <p
          className={`saved-message ${
            showingSavedMessage ? "saved-message-shown" : "saved-message-hidden"
          }`}
          onTransitionEnd={() => setShowingSavedMessage(false)}
        >
          Saved
        </p>
      </div>
      <div className="name-header">
        <div
          className="avatar-container"
          onClick={() => {
            fileInput.current.click();
          }}
        >
          <img src={avatarURL} alt="Avatar" className="avatar"></img>
          <img
            src={process.env.PUBLIC_URL + "/icons/edit.png"}
            alt=""
            className="avatar-edit"
          ></img>
          <input
            type="file"
            id="avatar-input"
            name="avatar-input"
            className="hidden-file-input"
            ref={fileInput}
            accept="image/*"
            onChange={applyNewAvatar}
          ></input>
        </div>
        <div className="avatar-label">
          {editingCharName ? (
            <textarea
              id="char-name"
              name="char-name"
              className="char-name"
              autoFocus
              defaultValue={character.name}
              placeholder="Character Name"
              onBlur={(event) => {
                character.setName(event.target.value);
                setEditingCharName(false);
              }}
            ></textarea>
          ) : (
            <h1 className="char-name" onClick={() => setEditingCharName(true)}>
              {character.name || "Character Name"}
            </h1>
          )}
          <h2 className="player-name">{character.player}</h2>
          <MultiColumnDropdownComp
            buttonText={character.alignment}
            contents={alignmentList}
            onSelect={(newAlignment) => character.setAlignment(newAlignment)}
          ></MultiColumnDropdownComp>
          <p
            className="race"
            data-modal="race"
            onClick={() => {
              setCurrentModal("race");
            }}
          >
            {character.race.name}{" "}
            {character.race.subrace !== null
              ? `(${character.race.subrace})`
              : ""}
          </p>
          <RaceModal
            character={character}
            closeModal={closeModal}
            isOpen={currentModal === "race"}
          />
          <InlineClassListComp classes={character.classes} />
        </div>
      </div>
      <div className="xp-inspire-header">
        {character.xp.uses && <XpComp character={character}></XpComp>}
        {inspirationHeader}
      </div>
      <div className="combat-header">
        <div>
          <p>AC: {character.getArmorClass()}</p>
          <p>
            Initiative:{" "}
            {(character.getInitiative() >= 0 ? "+" : "") +
              character.getInitiative()}
          </p>
        </div>
        <div>
          <p>Max HP: {character.getMaxHitPoints()}</p>
          <p>Current HP: {character.getCurrentHitPoints()}</p>
          <p>Temp HP: {character.hitPoints.temp}</p>
        </div>
        <div>
          <p>
            Total Hit Dice:{" "}
            {character
              .getTotalHitDice()
              .map((die) => `${die.number}d${die.sides}`)
              .join(", ")}
          </p>
          <p>
            Current Hit Dice:{" "}
            {character
              .getCurrentHitDice()
              .map((die) => `${die.number}d${die.sides}`)
              .join(", ")}
          </p>
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
          id={"features"}
          tabName={"Features/Traits"}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <TabNavComp
          id={"buffs"}
          tabName={"Buffs/Debuffs"}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <TabNavComp
          id={"equipment"}
          tabName={"Equipment/Treasure"}
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
        <TabContentComp id={"features"} activeTab={activeTab}>
          <CharacterFeaturesTab character={character} />
        </TabContentComp>
        <TabContentComp id={"buffs"} activeTab={activeTab}>
          <CharacterBuffsTab character={character} />
        </TabContentComp>
        <TabContentComp id={"equipment"} activeTab={activeTab}>
          <CharacterEquipmentTab character={character} />
        </TabContentComp>
        <TabContentComp id={"spellcasting"} activeTab={activeTab}>
          <CharacterSpellcastingTab character={character} />
        </TabContentComp>
      </div>
    </div>
  );
};
export default CharacterPage;
