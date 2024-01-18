// Character's weapons/attacks, ammo/consumables
import "../styling/CharacterQuickItemsComp.css";

const CharacterQuickItemsComp = ({ character }) => {
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

  // Weapons list
  weapons = weapons.sort((first, second) =>
    first.name > second.name ? 1 : first.name === second.name ? 0 : -1
  );
  const strMod =
    Math.floor(
      character.stats.filter((stat) => stat.name === "STR")[0].score - 10
    ) / 2;
  const dexMod =
    Math.floor(
      character.stats.filter((stat) => stat.name === "DEX")[0].score - 10
    ) / 2;
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
        <div className="col-4">
          <p className="weapon">{item.name}</p>
          <p className="weapon-properties">
            {item.properties.join(", ") || ""}
          </p>
        </div>
        <p className="col-2">
          {attackMod >= 0 ? "+" : ""}
          {attackMod}
        </p>
        <p className="col-4">
          {damageDice}{" "}
          {damageMod > 0
            ? ` + ${damageMod}`
            : damageMod < 0
            ? ` - ${Math.abs(damageMod)}`
            : ""}
          {` ${item.damage.type}`}
          {activatedDamage}
        </p>
        <p className="col-2">
          {item.activation ? (item.activated ? "Yes" : "No") : "-"}
        </p>
      </div>
    );
  });

  // Consumables list
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

  // Convert to HTML
  for (let subtype in itemizedConsumables) {
    itemizedConsumables[subtype] = itemizedConsumables[subtype].map(
      (item, i) => (
        <div key={i} className="row-flex">
          <div className="col-6">{item.name}</div>
          <div className="col-6">{item.count}</div>
        </div>
      )
    );
  }

  return (
    <>
      <div className="col-12 row-flex">
        <div className="col-12 col-flex">
          <div className="grid-tile">
            <h1>Weapons</h1>
            <div className="col-flex">
              <div className="row-flex">
                <h2 className="col-4">Name</h2>
                <h2 className="col-2">Attack</h2>
                <h2 className="col-4">Damage</h2>
                <h2 className="col-2">Activated</h2>
              </div>
              {weapons}
            </div>
          </div>
          <div className="grid-tile">
            <h1>Consumables</h1>
            <div className="col-flex">
              <div className="row-flex">
                <h2 className="col-6">Name</h2>
                <h2 className="col-6">Amount</h2>
              </div>
              {Object.keys(itemizedConsumables).map((subtype) => (
                <div key={subtype}>
                  <div className="row-flex">
                    <h3>{subtype}</h3>
                  </div>
                  {itemizedConsumables[subtype]}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CharacterQuickItemsComp;
