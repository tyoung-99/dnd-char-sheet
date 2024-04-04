import { useState, useEffect } from "react";
import EditorConvertToJSON from "./EditorConvertToJSON";

const CharacterAppearanceComp = ({
  character,
  charChangeFlag,
  setCharChangeFlag,
}) => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [appearance, setAppearance] = useState();

  useEffect(() => {
    setAppearance(character.appearance);
    setDataLoaded(true);
  }, [character, charChangeFlag]);

  const updateAppearance = (newAppearance) => {
    setAppearance(newAppearance);
    character.setAppearance(newAppearance);
    setCharChangeFlag((old) => !old);
  };

  if (!dataLoaded)
    return (
      <div className="grid-tile">
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="grid-tile">
      <h1>Appearance</h1>
      <div className="row-flex">
        <div className="col-1_3">
          <h2>Age</h2>
          <input
            type="text"
            id="age"
            name="age"
            value={appearance.age}
            onChange={(event) => {
              const newAppearance = { ...appearance };
              newAppearance.age = event.target.value;
              updateAppearance(newAppearance);
            }}
          ></input>
        </div>
        <div className="col-1_3">
          <h2>Height</h2>
          <input
            type="text"
            id="height"
            name="height"
            value={appearance.height}
            onChange={(event) => {
              const newAppearance = { ...appearance };
              newAppearance.height = event.target.value;
              updateAppearance(newAppearance);
            }}
          ></input>
        </div>
        <div className="col-1_3">
          <h2>Weight</h2>
          <input
            type="text"
            id="weight"
            name="weight"
            value={appearance.weight}
            onChange={(event) => {
              const newAppearance = { ...appearance };
              newAppearance.weight = event.target.value;
              updateAppearance(newAppearance);
            }}
          ></input>
        </div>
      </div>
      <div className="row-flex">
        <div className="col-1_3">
          <h2>Eyes</h2>
          <input
            type="text"
            id="eyes"
            name="eyes"
            value={appearance.eyes}
            onChange={(event) => {
              const newAppearance = { ...appearance };
              newAppearance.eyes = event.target.value;
              updateAppearance(newAppearance);
            }}
          ></input>
        </div>
        <div className="col-1_3">
          <h2>Skin</h2>
          <input
            type="text"
            id="skin"
            name="skin"
            value={appearance.skin}
            onChange={(event) => {
              const newAppearance = { ...appearance };
              newAppearance.skin = event.target.value;
              updateAppearance(newAppearance);
            }}
          ></input>
        </div>
        <div className="col-1_3">
          <h2>Hair</h2>
          <input
            type="text"
            id="hair"
            name="hair"
            value={appearance.hair}
            onChange={(event) => {
              const newAppearance = { ...appearance };
              newAppearance.hair = event.target.value;
              updateAppearance(newAppearance);
            }}
          ></input>
        </div>
      </div>
      <h2>Description</h2>
      <EditorConvertToJSON
        wrapperClassName="wysiwyg-textbox-wrapper"
        editorClassName="wysiwyg-textbox-editor"
        onBlur={(contentJSON) => {
          const newAppearance = { ...appearance };
          newAppearance.desc = contentJSON;
          updateAppearance(newAppearance);
        }}
        defaultTextJSON={appearance.desc}
      />
    </div>
  );
};

export default CharacterAppearanceComp;
