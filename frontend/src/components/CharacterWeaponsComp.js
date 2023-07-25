// Character's weapons/attacks, ammo
import "../styling/CharacterWeaponsComp.css";

const CharacterWeaponsComp = ({ character }) => {
  const weapons = character.equipment.map((item, i) => {
    if (item.type === "weapon" && item.equipped === true) {
      const damageDice = `${item.damage.dice}d${item.damage.sides}`;

      const strMod =
        Math.floor(
          character.stats.filter((stat) => stat.name === "STR")[0].score - 10
        ) / 2;
      const dexMod =
        Math.floor(
          character.stats.filter((stat) => stat.name === "DEX")[0].score - 10
        ) / 2;

      const abilityMod =
        item.subtypes.includes("Ranged") ||
        (item.properties.includes("Finesse") && dexMod > strMod)
          ? dexMod
          : strMod;

      const profMod = item.prof_required.some((prof) =>
        character.weapon_profs.includes(prof)
      )
        ? character.prof_bonus
        : 0;

      const itemBonus = item.bonus || 0;

      const attackMod =
        abilityMod +
        profMod +
        itemBonus +
        (character.class_modifiers.attack || 0);
      const damageMod =
        abilityMod + itemBonus + (character.class_modifiers.damage || 0);

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
    }
    return null;
  });

  // TODO: Ammo section

  return (
    <>
      <div className="col-12 row-flex">
        <div className="col-12 col-flex">
          <div className="grid-tile">
            <h1>Weapons</h1>
            <div className="col-flex">
              <div className="row-flex">
                <p className="col-4">Name</p>
                <p className="col-2">Attack</p>
                <p className="col-4">Damage</p>
                <p className="col-2">Activated</p>
              </div>
              {weapons}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CharacterWeaponsComp;
