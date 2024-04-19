import { useState, useEffect } from "react";
import EditorConvertToJSON from "./EditorConvertToJSON";

const CharacterBackstoryComp = ({
  character,
  charChangeFlag,
  setCharChangeFlag,
}) => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [backstory, setBackstory] = useState();

  useEffect(() => {
    setBackstory(character.backstory);
    setDataLoaded(true);
  }, [character, charChangeFlag]);

  const updateBackstory = (newBackstory) => {
    setBackstory(newBackstory);
    character.setBackstory(newBackstory);
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
      <h1>Backstory</h1>
      <EditorConvertToJSON
        wrapperClassName="wysiwyg-textbox-wrapper"
        editorClassName="wysiwyg-textbox-editor no-scroll"
        onBlur={(contentJSON) => updateBackstory(contentJSON)}
        defaultTextJSON={backstory}
      />
    </div>
  );
};

export default CharacterBackstoryComp;
