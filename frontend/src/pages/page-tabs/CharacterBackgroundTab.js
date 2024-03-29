// Character's background details/backstory

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import EditorConvertToJSON from "../../components/EditorConvertToJSON";
import BackgroundCharacteristicModal from "../../components/modals/BackgroundCharacteristicModal";

const CharacterBackgroundTab = ({
  character,
  charChangeFlag,
  setCharChangeFlag,
  openModal,
  closeModal,
  currentModal,
}) => {
  const [dataLoaded, setDataLoaded] = useState(false);

  const srcList = useRef();
  const [imgURLs, setImgURLs] = useState([]);
  const [backgroundOptions, setBackgroundOptions] = useState([]);

  const [background, setBackground] = useState();
  const [appearance, setAppearance] = useState();
  const [backstory, setBackstory] = useState();

  console.log(backgroundOptions);

  useEffect(() => {
    setBackground(character.background);
    setAppearance(character.appearance);
    setBackstory(character.backstory);
    setDataLoaded(true);
  }, [character, charChangeFlag]);

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
      const newImgURLs = [];
      for (const id of appearance.pictureIds) {
        try {
          const imgBlob = await axios.get(`/api/img/char/${id}`, {
            responseType: "blob",
          });
          newImgURLs.push(URL.createObjectURL(imgBlob.data));
        } catch (error) {}
      }
      setImgURLs(newImgURLs);

      srcList.current = (await axios.get(`/api/sources`)).data;
      const newBackgrounds = (await axios.get(`/api/backgrounds`)).data;
      for (const background of newBackgrounds) {
        await replaceIdsWithData(background);
      }
      setBackgroundOptions(newBackgrounds);
    };

    if (dataLoaded) loadData();
  }, [appearance, dataLoaded]);

  const updateBackground = (newBackground) => {
    character.setBackground(newBackground);
    setCharChangeFlag((old) => !old);
  };

  const getSelectedBackground = () =>
    backgroundOptions.find(
      (checkBackground) => checkBackground._id === background.id
    );

  const getParentBackground = () => {
    const selected = getSelectedBackground();
    return backgroundOptions.find(
      (checkBackground) => checkBackground._id === selected.parent
    );
  };

  const getCharacteristicList = (category) => {
    let list = getSelectedBackground().suggestedCharacteristics[category];
    if (list.length > 0) return list;
    return getParentBackground().suggestedCharacteristics[category];
  };

  if (!dataLoaded) return;

  const backgroundDisplay = (
    <>
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
              {option.name}
            </option>
          ))}
        </select>{" "}
        <input
          type="text"
          id="customName"
          name="customName"
          value={background.displayName}
          onChange={(event) => {
            const newBackground = { ...background };
            newBackground.displayName = event.target.value;
            updateBackground(newBackground);
          }}
        ></input>
        <label htmlFor="customName"> (Customized Name)</label>
      </h1>
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
  );

  const appearanceDisplay = (
    <>
      <h1>Appearance</h1>
      <div className="row-flex">
        <div className="col-1_3">
          <h2>Age</h2>
          <p>{appearance.age}</p>
        </div>
        <div className="col-1_3">
          <h2>Height</h2>
          <p>{appearance.height}</p>
        </div>
        <div className="col-1_3">
          <h2>Weight</h2>
          <p>{appearance.weight}</p>
        </div>
      </div>
      <div className="row-flex">
        <div className="col-1_3">
          <h2>Eyes</h2>
          <p>{appearance.eyes}</p>
        </div>
        <div className="col-1_3">
          <h2>Skin</h2>
          <p>{appearance.skin}</p>
        </div>
        <div className="col-1_3">
          <h2>Hair</h2>
          <p>{appearance.hair}</p>
        </div>
      </div>
      <h2>Description</h2>
      <div className="float-right col-flex">
        {imgURLs.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${character.name}`}
            className="height-8"
          ></img>
        ))}
      </div>
      {appearance.desc.map((paragraph, i) => (
        <p key={i} className="text-block">
          {paragraph}
        </p>
      ))}
    </>
  );

  const backstoryDisplay = (
    <>
      <h1>Backstory</h1>
      {backstory.map((paragraph, i) => (
        <p key={i} className="text-block">
          {paragraph}
        </p>
      ))}
    </>
  );

  return (
    <div className="grid-container row-flex">
      <div className="col-flex">
        <div className="row-flex">
          <div className="col-1_2 grid-tile">{backgroundDisplay}</div>
          <div className="col-1_2 grid-tile">{appearanceDisplay}</div>
        </div>
        <div className="row-flex">
          <div className="col-1 grid-tile">{backstoryDisplay}</div>
        </div>
      </div>
    </div>
  );
};

export default CharacterBackgroundTab;
