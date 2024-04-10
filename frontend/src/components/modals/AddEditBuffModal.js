// Modal for adding or editing a user-configured buff

import GenericModal from "./GenericModal";
import { useState } from "react";
import EditorConvertToJSON from "../EditorConvertToJSON";
// import "../../styling/components/modals/AddEditBuffModal.css";

const AddEditBuffModal = ({
  character,
  setCharChangeFlag,
  closeModal,
  initialBuff,
  isDebuff,
}) => {
  const [isNewBuff, setIsNewBuff] = useState(!initialBuff);
  const [buff, setBuff] = useState(
    initialBuff || { name: "New buff", isDebuff: isDebuff, desc: ["test"] }
  );

  console.log(buff);

  const header = (
    <h1>
      {isNewBuff ? "Add" : "Edit"} {buff.isDebuff ? "Debuff" : "Buff"}
    </h1>
  );

  const body = (
    <>
      <p>
        <label htmlFor="name">Name: </label>
        <input
          id="name"
          name="name"
          value={buff.name}
          onChange={(event) =>
            setBuff((oldBuff) => {
              const newBuff = { ...oldBuff };
              newBuff.name = event.target.value;
              return newBuff;
            })
          }
        ></input>
      </p>
      <EditorConvertToJSON
        toolbarHidden
        stripPastedStyles
        wrapperClassName="wysiwyg-textbox-wrapper"
        editorClassName="wysiwyg-textbox-editor"
        defaultTextJSON={buff.desc}
        onBlur={(contentJSON) =>
          setBuff((oldBuff) => {
            const newBuff = { ...oldBuff };
            newBuff.desc = contentJSON;
            return newBuff;
          })
        }
      />
    </>
  );

  const footer = (
    <>
      {!isNewBuff && (
        <button
          className="delete-button"
          onClick={() => {
            // TODO: delete
            setCharChangeFlag((old) => !old);
            closeModal();
          }}
        >
          Delete
        </button>
      )}
      <button onClick={closeModal}>Cancel</button>
      <button
        onClick={async () => {
          if (isNewBuff) character.addBuff(buff);
          else character.editBuff(initialBuff, buff);
          setCharChangeFlag((old) => !old);
          closeModal();
        }}
      >
        Save
      </button>
    </>
  );

  return (
    <GenericModal
      header={header}
      body={body}
      footer={footer}
      category={"edit-buff"}
    />
  );
};

export default AddEditBuffModal;
