// Character's current buffs/debuffs

import "../../styling/pages/page-tabs/CharacterBuffsTab.css";
import { Fragment } from "react";
import AddEditBuffModal from "../../components/modals/AddEditBuffModal";
import EditorConvertToJSON from "../../components/EditorConvertToJSON";

const CharacterBuffsTab = ({
  character,
  charChangeFlag,
  setCharChangeFlag,
  openModal,
  closeModal,
  currentModal,
}) => {
  const parseBuff = (currentBuff, i) => {
    const modalName = `${currentBuff.isDebuff ? "de" : ""}buff${i}`;
    return (
      <Fragment key={i}>
        <div className="clickable" onClick={(e) => openModal(e, modalName)}>
          <h2>{currentBuff.name}</h2>
          <EditorConvertToJSON
            readOnly
            toolbarHidden
            editorClassName="wysiwyg-textbox-editor"
            defaultTextJSON={currentBuff.desc}
          />
        </div>
        {currentModal === modalName && (
          <AddEditBuffModal
            character={character}
            setCharChangeFlag={setCharChangeFlag}
            closeModal={closeModal}
            initialBuff={currentBuff}
            isDebuff={currentBuff.isDebuff}
          />
        )}
      </Fragment>
    );
  };

  let buffs = [],
    debuffs = [];

  character.buffs.forEach((currentBuff) => {
    if (currentBuff.isDebuff) debuffs.push(currentBuff);
    else buffs.push(currentBuff);
  });

  buffs = buffs.map(parseBuff);
  debuffs = debuffs.map(parseBuff);

  return (
    <div className="grid-container row-flex">
      <div className="col-flex col-1">
        <div className="grid-tile row-flex borderless">
          <button className="add-buff-button">Add Buff/Debuff</button>
        </div>
        <div className="row-flex">
          <div className="col-1_2 grid-tile">
            <h1>Buffs</h1>
            {buffs.length > 0 ? buffs : <p>-None-</p>}
          </div>
          <div className="col-1_2 grid-tile">
            <h1>Debuffs</h1>
            {debuffs.length > 0 ? debuffs : <p>-None-</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterBuffsTab;
