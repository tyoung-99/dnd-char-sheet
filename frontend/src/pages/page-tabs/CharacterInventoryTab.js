// Character's inventory/equipment
import "../../styling/CharacterInventoryTab.css";

const CharacterInventoryTab = ({ character }) => {
  let itemizedInventory = {};
  let treasure = [];
  character.equipment.forEach((item) => {
    if (item.type === "Treasure") {
      treasure.push(item);
    } else {
      if (!(item.type in itemizedInventory)) {
        itemizedInventory[item.type] = [];
      }
      itemizedInventory[item.type].push(item);
    }
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
  treasure = treasure.sort((first, second) =>
    first.name > second.name ? 1 : first.name === second.name ? 0 : -1
  );

  // Convert to HTML
  for (let type in itemizedInventory) {
    itemizedInventory[type] = itemizedInventory[type].map((item, i) => (
      <div key={i} className="row-flex">
        <div className="col-6">{item.name}</div>
        <div className="col-6 text-center">{item.count}</div>
      </div>
    ));
  }
  treasure = treasure.map((item, i) => {
    const COIN_TYPES = [
      ["pp", 1000],
      ["gp", 100],
      ["ep", 50],
      ["sp", 10],
    ];
    let value = item.value * item.count;
    let coin = "cp";
    for (let i = 0; i < 4; ++i) {
      if (value % COIN_TYPES[i][1] === 0) {
        value = value / COIN_TYPES[i][1];
        coin = COIN_TYPES[i][0];
        break;
      }
    }

    return (
      <div key={i} className="row-flex">
        <div className="col-4">{item.name}</div>
        <div className="col-4 text-center">{item.count}</div>
        <div className="col-4 text-center">
          {value} {coin}
        </div>
      </div>
    );
  });

  return (
    <>
      <div className="grid-container row-flex">
        <div className="col-12 col-flex">
          <div className="grid-tile row-flex coins">
            <h1 className="col-2 header-override">{character.coins.cp} CP</h1>
            <h1 className="col-2 header-override">{character.coins.sp} SP</h1>
            <h1 className="col-2 header-override">{character.coins.ep} EP</h1>
            <h1 className="col-2 header-override">{character.coins.gp} GP</h1>
            <h1 className="col-2 header-override">{character.coins.pp} PP</h1>
          </div>
        </div>
      </div>
      <div className="grid-container row-flex">
        <div className="grid-tile col-6 col-flex">
          <div className="row-flex">
            <h1 className="col-6">Item</h1>
            <h1 className="col-6 text-center">Count</h1>
          </div>
          {Object.keys(itemizedInventory).map((type) => (
            <div key={type}>
              <h1>{type}</h1>
              {itemizedInventory[type]}
            </div>
          ))}
        </div>
        <div className="grid-tile col-6 col-flex">
          <div className="row-flex">
            <h1 className="col-4">Treasure</h1>
            <h1 className="col-4 text-center">Count</h1>
            <h1 className="col-4 text-center">Value</h1>
          </div>
          {treasure}
        </div>
      </div>
    </>
  );
};

export default CharacterInventoryTab;
