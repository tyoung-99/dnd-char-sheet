// Character's weapons/attacks, ammo/consumables

import ItemModal from "./modals/ItemModal";
import "../styling/components/CharacterQuickItemsComp.css";

const CharacterQuickItemsComp = ({
  character,
  openModal,
  closeModal,
  currentModal,
}) => {
  const handleWeapons = (weapons) => {
    weapons = weapons.sort((first, second) =>
      first.name > second.name ? 1 : first.name === second.name ? 0 : -1
    );
    weapons = weapons.map((item, i) => {
      const [[attackMod], [damage]] = character.getAttack(item);

      return (
        <div key={i} className="row-flex">
          <div
            className="col-1_3 clickable"
            onClick={(e) => openModal(e, `quickWeapon${i}`)}
          >
            <p className="weapon">{item.name}</p>
            <p className="weapon-properties">
              {item.properties.join(", ") || ""}
            </p>
          </div>
          {currentModal === `quickWeapon${i}` && (
            <ItemModal
              character={character}
              closeModal={closeModal}
              item={item}
            />
          )}
          <p className="col-1_6">+{attackMod}</p>
          <p className="col-1_3">{damage}</p>
          <p className="col-1_6">
            {typeof item.activated === "boolean"
              ? item.activated
                ? "Yes"
                : "No"
              : "-"}
          </p>
        </div>
      );
    });

    return weapons;
  };

  const handleConsumables = (consumables) => {
    let itemizedConsumables = {};

    // 1st subtype takes priority for sorting
    consumables.forEach((item) => {
      if (!(item.subtypes[0] in itemizedConsumables)) {
        itemizedConsumables[item.subtypes[0]] = [];
      }
      itemizedConsumables[item.subtypes[0]].push(item);
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
              <p
                className={`col-1_2${position} clickable`}
                onClick={(e) => openModal(e, `quickConsumable${subtype}${i}`)}
              >
                {item.name}
              </p>
              {currentModal === `quickConsumable${subtype}${i}` && (
                <ItemModal
                  character={character}
                  closeModal={closeModal}
                  item={item}
                />
              )}
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
