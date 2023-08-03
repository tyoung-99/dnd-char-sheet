// Character's inventory/equipment

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
      {Object.keys(itemizedInventory).map((type) => (
        <div key={type}>
          <div className="row-flex">
            <h2>{type}</h2>
          </div>
          {itemizedInventory[type]}
        </div>
      ))}
    </>
  );
};

export default CharacterInventoryTab;
