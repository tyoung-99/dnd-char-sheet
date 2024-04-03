import { useState, useEffect } from "react";
import axios from "axios";
import EditorConvertToJSON from "./EditorConvertToJSON";

const CharacterAppearanceComp = ({
  character,
  charChangeFlag,
  setCharChangeFlag,
  openModal,
  closeModal,
  currentModal,
}) => {
  const [dataLoaded, setDataLoaded] = useState(false);

  const [imgURLs, setImgURLs] = useState([]);
  const [appearance, setAppearance] = useState();

  useEffect(() => {
    const loadData = async () => {
      setAppearance(character.appearance);

      const newImgURLs = [];
      for (const id of character.appearance.pictureIds) {
        try {
          const imgBlob = await axios.get(`/api/img/char/${id}`, {
            responseType: "blob",
          });
          newImgURLs.push(URL.createObjectURL(imgBlob.data));
        } catch (error) {}
      }
      setImgURLs(newImgURLs);

      setDataLoaded(true);
    };

    loadData();
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
      <EditorConvertToJSON
        wrapperClassName="wysiwyg-textbox-wrapper"
        editorClassName="wysiwyg-textbox-editor"
        onChange={(contentJSON) => {
          const newAppearance = { ...appearance };
          newAppearance.desc = contentJSON;
          updateAppearance(newAppearance);
        }}
        defaultTextJSON={appearance.desc}
      />
      {/* {appearance.desc.map((paragraph, i) => (
        <p key={i} className="text-block">
          {paragraph}
        </p>
      ))} */}
    </div>
  );
};

export default CharacterAppearanceComp;
