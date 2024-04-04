// Uses react-draft-wysiwyg for a textbox converting to/from JSON

import React, { useState, useEffect } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import "../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const EditorConvertToJSON = ({ defaultTextJSON, ...props }) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  useEffect(() => {
    if (defaultTextJSON) {
      try {
        const contentState = convertFromRaw(defaultTextJSON);
        setEditorState(EditorState.createWithContent(contentState));
      } catch (error) {
        console.error("Error parsing default text JSON:", error);
      }
    }
  }, [defaultTextJSON]);

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const onBlur = () =>
    props.onBlur(convertToRaw(editorState.getCurrentContent()));

  return (
    <Editor
      {...props}
      editorState={editorState}
      onEditorStateChange={onEditorStateChange}
      onBlur={onBlur}
    />
  );
};

export default EditorConvertToJSON;
