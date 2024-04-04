// Character's background, appearance, backstory

import CharacterBackgroundComp from "../../components/CharacterBackgroundComp";
import CharacterAppearanceComp from "../../components/CharacterAppearanceComp";
import CharacterBackstoryComp from "../../components/CharacterBackstoryComp";

const CharacterBackgroundTab = ({
  character,
  charChangeFlag,
  setCharChangeFlag,
  openModal,
  closeModal,
  currentModal,
}) => {
  return (
    <div className="grid-container row-flex">
      <div className="col-flex col-1">
        <div className="row-flex">
          <div className="col-1_2">
            <CharacterBackgroundComp
              character={character}
              charChangeFlag={charChangeFlag}
              setCharChangeFlag={setCharChangeFlag}
              openModal={openModal}
              closeModal={closeModal}
              currentModal={currentModal}
            />
          </div>
          <div className="col-1_2">
            <CharacterAppearanceComp
              character={character}
              charChangeFlag={charChangeFlag}
              setCharChangeFlag={setCharChangeFlag}
            />
          </div>
        </div>
        <div className="row-flex">
          <div className="col-1">
            <CharacterBackstoryComp
              character={character}
              charChangeFlag={charChangeFlag}
              setCharChangeFlag={setCharChangeFlag}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterBackgroundTab;
