// Character's racial/class/background features, plus feats

import EditorConvertToJSON from "../../components/EditorConvertToJSON";

const CharacterFeaturesTab = ({ character }) => {
  let fromClass = character.getFeatures({ fromClass: true });
  let fromOther = character.getFeatures({
    fromRace: true,
    fromBackground: true,
  });
  fromOther = fromOther.concat(character.getFeats());

  fromClass = fromClass.map((ability, i) => {
    if (ability.invisible) return null;
    return (
      <div key={i}>
        <h2 className="float-right">{ability.class}</h2>
        <h1>{ability.displayName || ability.name}</h1>
        <EditorConvertToJSON
          readOnly
          toolbarHidden
          wrapperClassName="wysiwyg-textbox-wrapper"
          editorClassName="wysiwyg-textbox-editor"
          defaultTextJSON={ability.description}
        />
      </div>
    );
  });
  fromOther = fromOther.map((ability, i) => {
    if (ability.invisible) return null;
    return (
      <div key={i}>
        <h2 className="float-right">
          {ability.background ||
            ability.race ||
            ability.subrace ||
            ability.feat}
        </h2>
        <h1>{ability.displayName || ability.name}</h1>
        <EditorConvertToJSON
          readOnly
          toolbarHidden
          wrapperClassName="wysiwyg-textbox-wrapper"
          editorClassName="wysiwyg-textbox-editor"
          defaultTextJSON={ability.description}
        />
      </div>
    );
  });

  return (
    <div className="grid-container row-flex">
      <div className="col-1_2 grid-tile">{fromClass}</div>
      <div className="col-1_2 grid-tile">{fromOther}</div>
    </div>
  );
};

export default CharacterFeaturesTab;
