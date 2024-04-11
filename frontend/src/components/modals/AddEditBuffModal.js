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
  const isNewBuff = !initialBuff;
  const [buff, setBuff] = useState(
    initialBuff || {
      name: "New Buff",
      desc: {
        blocks: [
          {
            key: "b5i0v",
            text: "Description",
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [
              {
                offset: 0,
                length: 28,
                style: "color-rgb(0,0,0)",
              },
              {
                offset: 0,
                length: 28,
                style: "fontsize-medium",
              },
              {
                offset: 0,
                length: 28,
                style:
                  'fontfamily--apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
              },
            ],
            entityRanges: [],
            data: {},
          },
        ],
        entityMap: {},
      },
      isDebuff: isDebuff,
      effects: [],
    }
  );

  console.log(buff);

  const header = (
    <h1>
      {isNewBuff ? "Add" : "Edit"} {buff.isDebuff ? "Debuff" : "Buff"}
    </h1>
  );

  const body = (
    <>
      <button
        onClick={() =>
          setBuff((oldBuff) => {
            const newBuff = { ...oldBuff };
            newBuff.isDebuff = !newBuff.isDebuff;
            return newBuff;
          })
        }
      >
        Switch to {buff.isDebuff ? "" : "de"}buff
      </button>
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
            character.deleteBuff(initialBuff);
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
