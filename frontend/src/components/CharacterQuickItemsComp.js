// Character's weapons/attacks, ammo/consumables
import "../styling/CharacterQuickItemsComp.css";

const CharacterQuickItemsComp = ({ character }) => {
  const handleWeapons = (weapons) => {
    weapons = weapons.sort((first, second) =>
      first.name > second.name ? 1 : first.name === second.name ? 0 : -1
    );
    const strMod = Math.floor(
      (character.stats.filter((stat) => stat.name === "STR")[0].score - 10) / 2
    );
    const dexMod = Math.floor(
      (character.stats.filter((stat) => stat.name === "DEX")[0].score - 10) / 2
    );
    weapons = weapons.map((item, i) => {
      const damageDice = `${item.damage.dice}d${item.damage.sides}`;

      const abilityMod =
        item.subtypes.includes("Ranged") ||
        (item.properties.includes("Finesse") && dexMod > strMod)
          ? dexMod
          : strMod;

      const profMod = item.profRequired.some((prof) =>
        character.weaponProfs.includes(prof)
      )
        ? character.profBonus
        : 0;

      const itemBonus = item.bonus || 0;

      const attackMod = abilityMod + profMod + itemBonus;
      const damageMod = abilityMod + itemBonus;

      let activatedDamage;
      if (item.activation && item.activated) {
        activatedDamage = item.activation.damage
          ? ` + ${item.activation.damage.dice}d${item.activation.damage.sides} ${item.activation.damage.type}`
          : null;
      }

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
            {damageDice}{" "}
            {damageMod > 0
              ? ` + ${damageMod}`
              : damageMod < 0
              ? ` - ${Math.abs(damageMod)}`
              : ""}
            {` ${item.damage.type}`}
            {activatedDamage}
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
    }

    for (let subtype in itemizedConsumables) {
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
              <p className={`col-1_2 ${position}`}>{item.name}</p>
              <p className={`col-1_2 ${position}`}>{item.count}</p>
            </div>
          );
        }
      );
    }

    return itemizedConsumables;
  };

  let weapons = [],
    consumables = [];

  character.equipment.forEach((item) => {
    if (item.equipped === true) {
      if (item.type === "Weapon") {
        weapons.push(item);
      } else if (item.type === "Consumable") {
        consumables.push(item);
      }
    }
  });
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
