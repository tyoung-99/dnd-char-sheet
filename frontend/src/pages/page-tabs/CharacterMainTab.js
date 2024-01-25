// Character's stats/general combat abilities
import CharacterStatsComp from "../../components/CharacterStatsComp";
import CharacterQuickItemsComp from "../../components/CharacterQuickItemsComp";

const CharacterMainTab = ({ character }) => {
  return (
    <div className="grid-container row-flex">
      <div className="col-1_2">
        <CharacterStatsComp character={character} />
      </div>
      <div className="col-1_2">
        <CharacterQuickItemsComp character={character} />
      </div>
    </div>
  );
};

export default CharacterMainTab;
