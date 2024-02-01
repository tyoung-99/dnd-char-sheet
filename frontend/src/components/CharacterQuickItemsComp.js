// Character's weapons/attacks, ammo/consumables
import "../styling/CharacterQuickItemsComp.css";

const CharacterQuickItemsComp = ({ character }) => {
  const handleWeapons = (weapons) => {
    weapons = weapons.sort((first, second) =>
      first.name > second.name ? 1 : first.name === second.name ? 0 : -1
    );
    weapons = weapons.map((item, i) => {
      const [attackMod, damage] = character.getAttack(item);
      return (
        <div key={i} className="row-flex">
          <div className="col-1_3">
            <p className="weapon">{item.name}</p>
            <p className="weapon-properties">
              {item.properties.join(", ") || ""}
            </p>
          </div>
          <p className="col-1_6">
            {attackMod >= 0 ? "+" : ""}
            {attackMod}
          </p>
          <p className="col-1_3">
            {damage.map((dice) => {
              let damageMod;
              if (dice.mod > 0) {
                damageMod = ` + ${dice.mod}`;
              } else if (dice.mod === 0) {
                damageMod = "";
              } else {
                damageMod = ` - ${Math.abs(dice.mod)}`; // Uses absolute value so there's space between minus and number
              }
              return `${dice.number}d${dice.sides}${damageMod} ${dice.type}`;
            })}
          </p>
          <p className="col-1_6">
            {item.activation ? (item.activated ? "Yes" : "No") : "-"}
          </p>
        </div>
      );
    });

    return weapons;
  };

  const handleConsumables = (consumables) => {
    let itemizedConsumables = {};

    consumables.forEach((item) => {
      if (!(item.subtype in itemizedConsumables)) {
        itemizedConsumables[item.subtype] = [];
      }
      itemizedConsumables[item.subtype].push(item);
    });

    // Alphabetize categories & items w/in categories
    itemizedConsumables = Object.keys(itemizedConsumables)
      .sort()
      .reduce((sorted, subtype) => {
        sorted[subtype] = itemizedConsumables[subtype];
        return sorted;
      }, {});

    for (let subtype in itemizedConsumables) {
      itemizedConsumables[subtype] = itemizedConsumables[subtype].sort(
        (first, second) =>
          first.name > second.name ? 1 : first.name === second.name ? 0 : -1
      );

      itemizedConsumables[subtype] = itemizedConsumables[subtype].map(
        (item, i) => {
          let position = "";
          if (i < itemizedConsumables[subtype].length - 1) {
            position = position.concat(" flush-below");
          }
          if (i > 0) {
            position = position.concat(" flush-above");
          }

          return (
            <div key={i} className="row-flex">
              <p className={`col-1_2${position}`}>{item.name}</p>
              <p className={`col-1_2${position}`}>{item.count}</p>
            </div>
          );
        }
      );
    }

    return itemizedConsumables;
  };

  let weapons = character
    .getItemsByType("Weapon")
    .filter((item) => item.equipped);
  let consumables = character
    .getItemsByType("Consumable")
    .filter((item) => item.equipped);

  weapons = handleWeapons(weapons);
  consumables = handleConsumables(consumables);

  return (
    <>
      <div className="col-1 row-flex col-end">
        <div className="col-1 col-flex">
          <div className="grid-tile">
            <h1>Weapons</h1>
            <div className="col-flex">
              <div className="row-flex">
                <h2 className="col-1_3">Name</h2>
                <h2 className="col-1_6">Attack</h2>
                <h2 className="col-1_3">Damage</h2>
                <h2 className="col-1_6">Activated</h2>
              </div>
              {weapons.length === 0 ? (
                <p>-Equip a weapon to display it here-</p>
              ) : (
                weapons
              )}
            </div>
          </div>
          <div className="grid-tile col-end">
            <h1>Consumables</h1>
            <div className="col-flex">
              <div className="row-flex">
                <h2 className="col-1_2">Name</h2>
                <h2 className="col-1_2">Amount</h2>
              </div>
              {Object.keys(consumables).length === 0 ? (
                <p>-Equip a consumable to display it here-</p>
              ) : (
                Object.keys(consumables).map((subtype) => (
                  <div key={subtype}>
                    <div className="row-flex">
                      <h3 className="flush-below">{subtype}</h3>
                    </div>
                    {consumables[subtype]}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CharacterQuickItemsComp;
