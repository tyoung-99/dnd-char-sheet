// Character's inventory/equipment
import "../../styling/CharacterInventoryTab.css";

const CharacterInventoryTab = ({ character }) => {
  let itemizedInventory = {};
  character.equipment.forEach((item) => {
    if (!(item.type in itemizedInventory)) {
      itemizedInventory[item.type] = [];
    }
    itemizedInventory[item.type].push(item);
  });

  // Alphabetize categories & items w/in categories
  itemizedInventory = Object.keys(itemizedInventory)
    .sort()
    .reduce((sorted, type) => {
      sorted[type] = itemizedInventory[type];
      return sorted;
    }, {});
  for (let type in itemizedInventory) {
    itemizedInventory[type] = itemizedInventory[type].sort((first, second) =>
      first.name > second.name ? 1 : first.name === second.name ? 0 : -1
    );
  }

  // Convert to HTML
  for (let type in itemizedInventory) {
    itemizedInventory[type] = itemizedInventory[type].map((item, i) => (
      <div key={i} className="row-flex">
        <div className="col-6">{item.name}</div>
        <div className="col-6">{item.count}</div>
      </div>
    ));
  }

  return (
    <>
      <div className="row-flex col-6 coins">
        <h2 className="col-2">{character.coins.cp} CP</h2>
        <h2 className="col-2">{character.coins.sp} SP</h2>
        <h2 className="col-2">{character.coins.ep} EP</h2>
        <h2 className="col-2">{character.coins.gp} GP</h2>
        <h2 className="col-2">{character.coins.pp} PP</h2>
      </div>
      {Object.keys(itemizedInventory).map((type) => (
        <div key={type}>
          <h2>{type}</h2>
          {itemizedInventory[type]}
        </div>
      ))}
    </>
  );
};

export default CharacterInventoryTab;
