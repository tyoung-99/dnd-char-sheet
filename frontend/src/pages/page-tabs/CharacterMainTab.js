// Character's stats/general combat abilities
import CharacterStatsComp from "../../components/CharacterStatsComp";
import CharacterWeaponsComp from "../../components/CharacterWeaponsComp";

const CharacterMainTab = ({ character }) => {
  return (
    <div className="grid-container row-flex">
      <div className="col-6">
        <CharacterStatsComp character={character} />
      </div>
      <div className="col-6">
        <CharacterWeaponsComp character={character} />
      </div>
    </div>
  );
};

export default CharacterMainTab;
