// Character's stats/general combat abilities
import CharacterStatsComp from "../../components/CharacterStatsComp";
import CharacterQuickItemsComp from "../../components/CharacterQuickItemsComp";

const CharacterMainTab = ({
  character,
  openModal,
  closeModal,
  currentModal,
}) => {
  return (
    <div className="grid-container row-flex">
      <div className="col-1_2">
        <CharacterStatsComp
          character={character}
          openModal={openModal}
          closeModal={closeModal}
          currentModal={currentModal}
        />
      </div>
      <div className="col-1_2">
        <CharacterQuickItemsComp
          character={character}
          openModal={openModal}
          closeModal={closeModal}
          currentModal={currentModal}
        />
      </div>
    </div>
  );
};

export default CharacterMainTab;
