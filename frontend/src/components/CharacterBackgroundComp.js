import { Fragment, useState, useEffect, useRef } from "react";
import axios from "axios";
import EditorConvertToJSON from "./EditorConvertToJSON";
import BackgroundCharacteristicModal from "./modals/BackgroundCharacteristicModal";
import FeatureSkillProfComp from "./feature-components/FeatureSkillProfComp";
import FeatureToolProfComp from "./feature-components/FeatureToolProfComp";
import FeatureLanguageComp from "./feature-components/FeatureLanguageComp";

const CharacterBackgroundComp = ({
  character,
  charChangeFlag,
  setCharChangeFlag,
  openModal,
  closeModal,
  currentModal,
}) => {
  const SKILL_FEATURE_ID = "65fdd750a1fb13543c9b3b6c";
  const TOOL_LANG_FEATURE_ID = "65fdd88fa1fb13543c9b3b6d";

  const [dataLoaded, setDataLoaded] = useState(false);

  const srcList = useRef();
  const [backgroundOptions, setBackgroundOptions] = useState([]);

  const [background, setBackground] = useState();

  const [featureChoices, setFeatureChoices] = useState();
  const [originalFeatureChoices, setOriginalFeatureChoices] = useState();

  const replaceIdsWithData = async (background) => {
    background.source = srcList.current.find(
      (source) => source._id === background.source
    );

    if (background.features.length > 0) {
      background.features = (
        await axios.get(
          `/api/backgroundFeatures/multiple/${background.features}`
        )
      ).data;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      srcList.current = (await axios.get(`/api/sources`)).data;
      const newBackgrounds = (await axios.get(`/api/backgrounds`)).data;
      for (const background of newBackgrounds) {
        await replaceIdsWithData(background);
      }
      setBackgroundOptions(newBackgrounds);
    };

    loadData();
  }, []);

  useEffect(() => {
    setBackground(character.background);
    setFeatureChoices(structuredClone(character.featureChoices));
    setOriginalFeatureChoices(structuredClone(character.featureChoices));
    setDataLoaded(true);
  }, [character, charChangeFlag]);

  const addNewEffectChoices = (toAdd, effectChoices) => {
    for (const feature of toAdd) {
      if (
        feature.effects.length === 0 ||
        !feature.effects.some((checkEffect) => checkEffect.changes.choices)
      )
        continue;

      let addEffects = {};

      for (const effect of feature.effects) {
        let newChoice;
        const choices = effect.changes.choices;
        switch (effect.category) {
          case "AbilityScore":
            newChoice = [
              { ability: "STR", amount: 0, cap: effect.changes.choices.cap },
              { ability: "DEX", amount: 0, cap: effect.changes.choices.cap },
              { ability: "CON", amount: 0, cap: effect.changes.choices.cap },
              { ability: "INT", amount: 0, cap: effect.changes.choices.cap },
              { ability: "WIS", amount: 0, cap: effect.changes.choices.cap },
              { ability: "CHA", amount: 0, cap: effect.changes.choices.cap },
            ];
            break;
          case "Language":
            newChoice = new Array(choices).fill("");
            break;
          case "SkillProficiency":
          case "ToolProficiency":
          case "Feat":
            newChoice = new Array(choices[0]).fill("");
            break;
          default:
        }

        addEffects[effect.category] = newChoice;
      }

      effectChoices[feature._id] = addEffects;
    }
  };

  const resetFeatureChoices = (oldChoices, newBackgroundId) => {
    let newChoices = { ...oldChoices };
    newChoices.background = {};

    const newBackground = findBackgroundInList(newBackgroundId);

    let toAdd = newBackground.features;
    if (newBackground.parent) {
      toAdd = findBackgroundInList(newBackground.parent).features.concat(toAdd);
    }

    addNewEffectChoices(toAdd, newChoices.background);
    setFeatureChoices(newChoices);
    return newChoices;
  };

  const balanceToolsLanguages = (newFeatureChoices) => {
    const feature = newFeatureChoices.background[TOOL_LANG_FEATURE_ID];
    const toolsPicked =
      feature.ToolProficiency.length -
      feature.ToolProficiency.filter((x) => x === "").length;
    const langsPicked =
      feature.Language.length - feature.Language.filter((x) => x === "").length;

    // Resolves issue with empty array causing errors when length extended
    feature.ToolProficiency = feature.ToolProficiency.concat(["", ""]);
    feature.Language = feature.Language.concat(["", ""]);

    feature.ToolProficiency.length = 2 - langsPicked;
    feature.Language.length = 2 - toolsPicked;

    feature.ToolProficiency.forEach((tool, i) => {
      if (!tool) feature.ToolProficiency[i] = "";
    });
    feature.Language.forEach((lang, i) => {
      if (!lang) feature.Language[i] = "";
    });

    return newFeatureChoices;
  };

  const updateBackground = (
    newBackground = null,
    newFeatureChoices = null,
    newBackgroundName = null
  ) => {
    if (newBackground) {
      newFeatureChoices = resetFeatureChoices(featureChoices, newBackground.id);
    } else {
      newBackground = background;
      if (newFeatureChoices) {
        newFeatureChoices = balanceToolsLanguages(newFeatureChoices);
      } else {
        background.displayName = newBackgroundName;
        newFeatureChoices = featureChoices;
      }
    }
    character.setBackground(newBackground, newFeatureChoices);
    setCharChangeFlag((old) => !old);
  };

  const findBackgroundInList = (backgroundId) =>
    backgroundOptions.find(
      (checkBackground) => checkBackground._id === backgroundId
    );

  const getCharacteristicList = (category) => {
    const selected = findBackgroundInList(background.id);
    let list = selected.suggestedCharacteristics[category];
    if (list.length > 0) return list;
    return findBackgroundInList(selected.parent).suggestedCharacteristics[
      category
    ];
  };

  const displayFeature = (feature) => {
    if (feature.universal) return null;
    return (
      <Fragment key={feature._id}>
        <h2>Feature: {feature.displayName}</h2>
        <EditorConvertToJSON
          readOnly
          toolbarHidden
          wrapperClassName="wysiwyg-textbox-wrapper"
          editorClassName="wysiwyg-textbox-editor"
          defaultTextJSON={feature.description}
        />
      </Fragment>
    );
  };

  const getProfSuggestions = (profType) => {
    const selected = findBackgroundInList(background.id);
    if (selected.suggestedProficiencies[profType].length === 0) {
      const parent = findBackgroundInList(selected.parent);
      if (!parent || parent.suggestedProficiencies[profType].length === 0) {
        return "None";
      }
      return parent.suggestedProficiencies[profType].join(", ");
    }
    return selected.suggestedProficiencies[profType].join(", ");
  };

  const getFeatureComp = (type) => {
    let idNeeded;
    switch (type) {
      case "skills":
        idNeeded = SKILL_FEATURE_ID;
        break;
      case "tools":
      case "languages":
        idNeeded = TOOL_LANG_FEATURE_ID;
        break;
      default:
    }

    const selected = findBackgroundInList(background.id);
    let feature = selected.features.find(
      (checkFeature) => checkFeature._id === idNeeded
    );
    if (!feature) {
      feature = findBackgroundInList(selected.parent).features.find(
        (checkFeature) => checkFeature._id === idNeeded
      );
    }

    switch (type) {
      case "skills":
        return (
          <FeatureSkillProfComp
            featureType={"background"}
            featureId={feature._id}
            category={"SkillProficiency"}
            choices={feature.effects[0].changes.choices}
            featureChoices={featureChoices}
            setFeatureChoices={setFeatureChoices}
            originalFeatureChoices={originalFeatureChoices}
            existingProfs={character.getSkills()}
            onChangeCallBack={(newChoices) => {
              updateBackground(null, newChoices);
            }}
          />
        );
      case "tools":
        return (
          <FeatureToolProfComp
            featureType={"background"}
            featureId={feature._id}
            category={"ToolProficiency"}
            choices={feature.effects[0].changes.choices}
            featureChoices={featureChoices}
            setFeatureChoices={setFeatureChoices}
            originalFeatureChoices={originalFeatureChoices}
            existingProfs={character.getToolProfs()}
            onChangeCallBack={(newChoices) => {
              updateBackground(null, newChoices);
            }}
            isBackground={true}
          />
        );
      case "languages":
        return (
          <FeatureLanguageComp
            featureType={"background"}
            featureId={feature._id}
            category={"Language"}
            choices={feature.effects[1].changes.choices}
            featureChoices={featureChoices}
            setFeatureChoices={setFeatureChoices}
            onChangeCallBack={(newChoices) => {
              updateBackground(null, newChoices);
            }}
          />
        );
      default:
    }
  };

  if (!dataLoaded)
    return (
      <div className="grid-tile">
        <p>Loading...</p>
      </div>
    );

  const selected = findBackgroundInList(background.id);

  return (
    <div className="grid-tile">
      <h1>
        Background:{" "}
        <select
          name="background"
          id="background"
          value={background.id || ""}
          onChange={(event) => {
            const newBackground = { ...background };
            newBackground.id = event.target.value;
            newBackground.name = event.target[event.target.selectedIndex].text;
            updateBackground(newBackground);
          }}
        >
          <option hidden value={""}>
            Select Background
          </option>
          {backgroundOptions.map((option) => (
            <option key={option._id} value={option._id}>
              {option.name} ({option.source.abbr})
            </option>
          ))}
        </select>{" "}
        <input
          type="text"
          id="customName"
          name="customName"
          value={background.displayName}
          onChange={(event) => updateBackground(null, null, event.target.value)}
        ></input>
        <label htmlFor="customName"> (Customized Name)</label>
      </h1>
      {!selected ? null : (
        <>
          <p>
            {getFeatureComp("skills")} (Suggestions:{" "}
            {getProfSuggestions("skills")})
          </p>
          <p>
            {getFeatureComp("tools")} (Suggestions:{" "}
            {getProfSuggestions("tools")})
          </p>
          <p>
            {getFeatureComp("languages")} (Suggestions:{" "}
            {getProfSuggestions("languages")})
          </p>
          <p>Equipment:</p>
          {selected.parent &&
            findBackgroundInList(selected.parent).features.map(displayFeature)}
          {selected.features.map(displayFeature)}
          <h1>Characteristics</h1>
          <h2
            className="clickable"
            onClick={(e) => openModal(e, "personalityTraits")}
          >
            Personality Traits (Click for Suggestions)
          </h2>
          {currentModal === "personalityTraits" && (
            <BackgroundCharacteristicModal
              title={"Example Personality Traits"}
              characteristicList={getCharacteristicList("personalityTraits")}
              closeModal={closeModal}
            />
          )}
          <EditorConvertToJSON
            toolbarHidden
            wrapperClassName="wysiwyg-textbox-wrapper"
            editorClassName="wysiwyg-textbox-editor"
            onChange={(contentJSON) => {
              const newBackground = { ...background };
              newBackground.personalityTraits = contentJSON;
              updateBackground(newBackground);
            }}
            defaultTextJSON={background.personalityTraits}
          />
          <h2 className="clickable" onClick={(e) => openModal(e, "ideals")}>
            Ideals (Click for Suggestions)
          </h2>
          {currentModal === "ideals" && (
            <BackgroundCharacteristicModal
              title={"Example Ideals"}
              characteristicList={getCharacteristicList("ideals")}
              closeModal={closeModal}
            />
          )}
          <EditorConvertToJSON
            toolbarHidden
            wrapperClassName="wysiwyg-textbox-wrapper"
            editorClassName="wysiwyg-textbox-editor"
            onChange={(contentJSON) => {
              const newBackground = { ...background };
              newBackground.ideals = contentJSON;
              updateBackground(newBackground);
            }}
            defaultTextJSON={background.ideals}
          />
          <h2 className="clickable" onClick={(e) => openModal(e, "bonds")}>
            Bonds (Click for Suggestions)
          </h2>
          {currentModal === "bonds" && (
            <BackgroundCharacteristicModal
              title={"Example Bonds"}
              characteristicList={getCharacteristicList("bonds")}
              closeModal={closeModal}
            />
          )}
          <EditorConvertToJSON
            toolbarHidden
            wrapperClassName="wysiwyg-textbox-wrapper"
            editorClassName="wysiwyg-textbox-editor"
            onChange={(contentJSON) => {
              const newBackground = { ...background };
              newBackground.bonds = contentJSON;
              updateBackground(newBackground);
            }}
            defaultTextJSON={background.bonds}
          />
          <h2 className="clickable" onClick={(e) => openModal(e, "flaws")}>
            Flaws (Click for Suggestions)
          </h2>
          {currentModal === "flaws" && (
            <BackgroundCharacteristicModal
              title={"Example Flaws"}
              characteristicList={getCharacteristicList("flaws")}
              closeModal={closeModal}
            />
          )}
          <EditorConvertToJSON
            toolbarHidden
            wrapperClassName="wysiwyg-textbox-wrapper"
            editorClassName="wysiwyg-textbox-editor"
            onChange={(contentJSON) => {
              const newBackground = { ...background };
              newBackground.flaws = contentJSON;
              updateBackground(newBackground);
            }}
            defaultTextJSON={background.flaws}
          />
        </>
      )}
    </div>
  );
};

export default CharacterBackgroundComp;
