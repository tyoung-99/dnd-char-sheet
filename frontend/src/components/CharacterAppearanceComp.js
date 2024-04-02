import { useState, useEffect } from "react";
import axios from "axios";

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
    </div>
  );
};

export default CharacterAppearanceComp;
