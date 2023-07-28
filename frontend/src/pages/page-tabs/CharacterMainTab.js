// Character's stats/general combat abilities
import CharacterStatsComp from "../../components/CharacterStatsComp";
import CharacterQuickItemsComp from "../../components/CharacterQuickItemsComp";

const CharacterMainTab = ({ character }) => {
  return (
    <div className="grid-container row-flex">
      <div className="col-6">
        <CharacterStatsComp character={character} />
      </div>
      <div className="col-6">
        <CharacterQuickItemsComp character={character} />
      </div>
    </div>
  );
};

export default CharacterMainTab;
