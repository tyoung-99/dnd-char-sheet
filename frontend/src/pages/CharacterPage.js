// Full character sheet

import "../styling/pages/CharacterPage.css";
import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Character from "../Character";
import TabNavComp from "../components/TabNavComp";
import InlineClassListComp from "../components/InlineClassListComp";
import TabContentComp from "../components/TabContentComp";
import NumInputComp from "../components/NumInputComp";
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
import GenericBreakdownModal from "../components/modals/GenericBreakdownModal";
import CurrentHitDiceModal from "../components/modals/CurrentHitDiceModal";
import MaxHitPointsModal from "../components/modals/MaxHitPointsModal";

const CharacterPage = () => {
  const [activeTab, setActiveTab] = useState("main");
  const [currentModal, setCurrentModal] = useState("");

  const { characterID } = useParams();
  const [character, setCharacter] = useState();
  const [avatarURL, setAvatarURL] = useState();
  const [alignmentList, setAlignmentList] = useState();

  const [showingSavedMessage, setShowingSavedMessage] = useState(false);
  const fileInput = useRef(null);

  const [charName, setCharName] = useState("");

  useEffect(() => {
    const loadData = async () => {
      let response = await axios.get(`/api/characters/${characterID}`);
      const newChar = await Character.create(
        response.data,
        setShowingSavedMessage
      );

      setCharacter(newChar);
      setCharName(newChar.name);
      refreshAvatarImg(newChar);

      response = await axios.get("/api/alignments");
      setAlignmentList(response.data);
    };

    loadData();
  }, [characterID]);

  const openModal = (event, modalName) => {
    event.preventDefault();
    event.stopPropagation();
    setCurrentModal(modalName);
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

  const [armorClassVal, armorClassBreakdown] = character.getArmorClass();
  const [initiativeVal, initiativeBreakdown] = character.getInitiative();
  let [totalHitDice, totalHitDiceBreakdown] = character.getTotalHitDice();
  const [maxHitPoints, maxHitPointsBreakdown] = character.getMaxHitPoints();
  const [currentHitPoints, currentHitPointsBreakdown] =
    character.getCurrentHitPoints();

  totalHitDice = totalHitDice
    .map((die) => `${die.number}d${die.sides}`)
    .join(", ");

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
          <h1
            className="char-name"
            contentEditable
            suppressContentEditableWarning
            onBlur={(event) => {
              if (event.target.innerText === "") {
                character.setName("Character Name");
                setCharName("Character Name");
              } else {
                character.setName(event.target.innerText);
                setCharName(event.target.innerText);
              }
            }}
          >
            {charName}
          </h1>
          <h2 className="player-name">{character.player}</h2>
          <MultiColumnDropdownComp
            buttonText={character.alignment}
            contents={alignmentList}
            onSelect={(newAlignment) => character.setAlignment(newAlignment)}
          ></MultiColumnDropdownComp>
          <p className="race clickable" onClick={(e) => openModal(e, "race")}>
            {character.ref_subraceName}
          </p>
          {currentModal === "race" && (
            <RaceModal character={character} closeModal={closeModal} />
          )}
          <InlineClassListComp classes={character.classes} />
        </div>
      </div>
      <div className="xp-inspire-header">
        {character.xp.uses && <XpComp character={character}></XpComp>}
        {inspirationHeader}
      </div>
      <div className="combat-header">
        <div>
          <p className="clickable" onClick={(e) => openModal(e, "armorClass")}>
            AC: {armorClassVal}
          </p>
          {currentModal === "armorClass" && (
            <GenericBreakdownModal
              title={"Armor Class"}
              closeModal={closeModal}
              breakdown={armorClassBreakdown}
              total={armorClassVal}
            />
          )}
          <p className="clickable" onClick={(e) => openModal(e, "initiative")}>
            Initiative: {(initiativeVal >= 0 ? "+" : "") + initiativeVal}
          </p>
          {currentModal === "initiative" && (
            <GenericBreakdownModal
              title={"Initiative"}
              closeModal={closeModal}
              breakdown={initiativeBreakdown}
              total={initiativeVal}
            />
          )}
        </div>
        <div className="row-flex">
          <div>
            <p
              className="clickable"
              onClick={(e) => openModal(e, "maxHitPoints")}
            >
              Max HP: {maxHitPoints}
            </p>
            {currentModal === "maxHitPoints" && (
              <MaxHitPointsModal
                character={character}
                closeModal={closeModal}
                breakdown={maxHitPointsBreakdown}
                total={maxHitPoints}
              />
            )}
            <p
              className="clickable"
              onClick={(e) => openModal(e, "currentHitPoints")}
            >
              Current HP: {currentHitPoints}
            </p>
            {currentModal === "currentHitPoints" && (
              <GenericBreakdownModal
                title={"Current Hit Points"}
                closeModal={closeModal}
                breakdown={currentHitPointsBreakdown}
                total={currentHitPoints}
              />
            )}
            <p>Temp HP: {character.hitPoints.temp}</p>
          </div>
          <div className="col-flex hp-buttons">
            <div>
              <NumInputComp
                buttonText={"Heal"}
                callback={(amount) => character.restoreHitPoints(amount)} // Can't pass directly or "this" points to wrong element
              />
            </div>
            <div>
              <NumInputComp
                buttonText={"Damage"}
                callback={(amount) => character.dealDamage(amount)}
              />
            </div>
            <div>
              <NumInputComp
                buttonText={"New Temp HP"}
                callback={(amount) => character.replaceTempHitPoints(amount)}
              />
            </div>
          </div>
        </div>
        <div>
          <p
            className="clickable"
            onClick={(e) => openModal(e, "totalHitDice")}
          >
            Total Hit Dice: {totalHitDice}
          </p>
          {currentModal === "totalHitDice" && (
            <GenericBreakdownModal
              title={"Total Hit Dice"}
              closeModal={closeModal}
              breakdown={totalHitDiceBreakdown}
              total={totalHitDice}
            />
          )}
          <p
            className="clickable"
            onClick={(e) => openModal(e, "currentHitDice")}
          >
            Current Hit Dice:{" "}
            {character
              .getCurrentHitDice()
              .map((die) => `${die.number}d${die.sides}`)
              .join(", ")}
          </p>
          {currentModal === "currentHitDice" && (
            <CurrentHitDiceModal
              character={character}
              closeModal={closeModal}
            />
          )}
        </div>
        <DeathSavesComp character={character} />
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
          <CharacterMainTab
            character={character}
            openModal={openModal}
            closeModal={closeModal}
            currentModal={currentModal}
          />
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
          <CharacterEquipmentTab
            character={character}
            openModal={openModal}
            closeModal={closeModal}
            currentModal={currentModal}
          />
        </TabContentComp>
        <TabContentComp id={"spellcasting"} activeTab={activeTab}>
          <CharacterSpellcastingTab character={character} />
        </TabContentComp>
      </div>
    </div>
  );
};
export default CharacterPage;
