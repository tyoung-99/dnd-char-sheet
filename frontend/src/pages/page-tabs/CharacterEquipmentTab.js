// Character's inventory/equipment

import { Fragment } from "react";
import ItemModal from "../../components/modals/ItemModal";
import NumInputComp from "../../components/NumInputComp";
import "../../styling/pages/page-tabs/CharacterEquipmentTab.css";

const CharacterEquipmentTab = ({
  character,
  charChangeFlag,
  setCharChangeFlag,
  openModal,
  closeModal,
  currentModal,
}) => {
  const COIN_CONVERSIONS = [
    ["cp", 1],
    ["sp", 10],
    ["ep", 50],
    ["gp", 100],
    ["pp", 1000],
  ];

  let itemizedInventory = character.getItems();
  let treasure = character.getTreasure();
  const attunable = [];
  let attuned = [];

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

  for (const type in itemizedInventory) {
    for (const item of itemizedInventory[type]) {
      if (typeof item.toggles.Attuned === "boolean") {
        attunable.push(item);
        if (item.toggles.Attuned) attuned.push(`${attunable.length - 1}`);
      }
    }
    itemizedInventory[type] = itemizedInventory[type].map((item, i) => (
      <Fragment key={i}>
        <div className="row-flex item-entry">
          <div
            className="col-1_2 clickable"
            onClick={(e) => openModal(e, `item${type}${i}`)}
          >
            {item.name}
          </div>
          <div className="col-3_8 text-center">{item.count}</div>
          <div className="col-1_8">
            <button
              className="x-button"
              title="Remove item"
              onClick={() => {
                character.removeItem(item);
                setCharChangeFlag((old) => !old);
              }}
            >
              X
            </button>
          </div>
        </div>
        {currentModal === `item${type}${i}` && (
          <ItemModal
            character={character}
            setCharChangeFlag={setCharChangeFlag}
            closeModal={closeModal}
            item={item}
          />
        )}
      </Fragment>
    ));
  }

  let treasureSumCP = 0;
  treasure = treasure.map((item, i) => {
    let valOfOne = item.value.reduce((totalCP, current) => {
      return (totalCP +=
        COIN_CONVERSIONS.find((compare) => compare[0] === current[0])[1] *
        current[1]);
    }, 0);
    let value = valOfOne * item.count;
    treasureSumCP += value;

    let coin = "cp";
    for (let i = 4; i > 0; i--) {
      if (value % COIN_CONVERSIONS[i][1] === 0) {
        value = value / COIN_CONVERSIONS[i][1];
        coin = COIN_CONVERSIONS[i][0];
        break;
      }
    }

    return (
      <Fragment key={i}>
        <div className="row-flex item-entry">
          <div
            className="col-1_2 clickable"
            onClick={(e) => openModal(e, `treasure${i}`)}
          >
            {item.name}
          </div>
          <div className="col-1_6 text-center">{item.count}</div>
          <div className="col-1_6 text-center">
            {value} {coin}
          </div>
          <div className="col-1_6">
            <button
              className="x-button"
              title="Remove item"
              onClick={() => {
                character.removeItem(item);
                setCharChangeFlag((old) => !old);
              }}
            >
              X
            </button>
          </div>
        </div>
        {currentModal === `treasure${i}` && (
          <ItemModal
            character={character}
            setCharChangeFlag={setCharChangeFlag}
            closeModal={closeModal}
            item={item}
            isTreasure={true}
          />
        )}
      </Fragment>
    );
  });

  const treasureSums = [0, 0, 0, 0, 0];
  for (let i = 4; i >= 0; i--) {
    treasureSums[i] = parseInt(treasureSumCP / COIN_CONVERSIONS[i][1]);
    treasureSumCP = treasureSumCP % COIN_CONVERSIONS[i][1];
  }

  attuned = attuned.concat(["", "", ""]);
  attuned.length = 3;

  const attunementSection = (
    <div className="grid-tile attunements">
      <h1>Attunements</h1>
      {attuned.map((itemIndex, i) => (
        <select
          key={i}
          name={`attunement${i}`}
          id={`attunement${i}`}
          value={itemIndex}
          onChange={(event) => {
            const newIndex = event.target.value;
            if (itemIndex !== "") {
              const newItem = structuredClone(attunable[itemIndex]);
              newItem.toggles.Attuned = false;
              character.updateItem(attunable[itemIndex], newItem);
            }
            if (newIndex !== "") {
              const newItem = structuredClone(attunable[newIndex]);
              newItem.toggles.Attuned = true;
              character.updateItem(attunable[newIndex], newItem);
            }
            setCharChangeFlag((old) => !old);
          }}
        >
          <option value={""}>-None-</option>
          {attunable.map((item, j) => {
            if (attuned.includes(`${j}`) && `${j}` !== itemIndex) return null;
            return (
              <option key={j} value={j}>
                {item.name}
              </option>
            );
          })}
        </select>
      ))}
    </div>
  );

  return (
    <div className="grid-container row-flex">
      <div className="col-flex col-1_2">
        {attunementSection}
        <div className="grid-tile col-end">
          <div className="row-flex">
            <h1 className="col-1_2">Item</h1>
            <h1 className="col-3_8 text-center">Amount</h1>
            <div className="col-1_8">
              <button
                id="addItem"
                name="addItem"
                className="add-item"
                onClick={(e) => openModal(e, `itemNew`)}
              >
                Add item
              </button>
              {currentModal === `itemNew` && (
                <ItemModal
                  character={character}
                  setCharChangeFlag={setCharChangeFlag}
                  closeModal={closeModal}
                  item={null}
                />
              )}
            </div>
          </div>
          {Object.keys(itemizedInventory).length === 0 ? (
            <p>-None-</p>
          ) : (
            Object.keys(itemizedInventory).map((type) => (
              <div key={type}>
                <h1>{type}</h1>
                {itemizedInventory[type]}
              </div>
            ))
          )}
        </div>
      </div>
      <div className="col-flex col-1_2">
        <div className="grid-tile">
          <div className="row-flex coins">
            {COIN_CONVERSIONS.map(([coinName, _]) => (
              <span key={coinName} className="col-1_5 coin-entry col-flex">
                <input
                  type="number"
                  id={`coins${coinName.toUpperCase()}`}
                  name={`coins${coinName.toUpperCase()}`}
                  min={0}
                  value={character.coins[coinName]}
                  onChange={(event) => {
                    const newCoins = { ...character.coins };
                    newCoins[coinName] = event.target.value;
                    character.setCoins(newCoins);
                    setCharChangeFlag((old) => !old);
                  }}
                ></input>
                <span className="row-flex">
                  <span className="button-holder">
                    <NumInputComp
                      buttonText={"+"}
                      callback={(amount) => {
                        const newCoins = { ...character.coins };
                        newCoins[coinName] += amount;
                        character.setCoins(newCoins);
                        setCharChangeFlag((old) => !old);
                      }}
                      alignLeft={true}
                    />
                  </span>
                  <label htmlFor={`coins${coinName.toUpperCase()}`}>
                    {coinName.toUpperCase()}
                  </label>
                  <span className="button-holder">
                    <NumInputComp
                      buttonText={"-"}
                      callback={(amount) => {
                        const newCoins = { ...character.coins };
                        newCoins[coinName] -= amount;
                        if (newCoins[coinName] < 0) newCoins[coinName] = 0;
                        character.setCoins(newCoins);
                        setCharChangeFlag((old) => !old);
                      }}
                      alignLeft={false}
                    />
                  </span>
                </span>
              </span>
            ))}
          </div>
        </div>
        <div className="grid-tile col-end">
          <div className="row-flex">
            <h1 className="col-1_2">Treasure</h1>
            <h1 className="col-1_6 text-center">Amount</h1>
            <h1 className="col-1_6 text-center">Value</h1>
            <div className="col-1_6">
              <button
                id="addItem"
                name="addItem"
                className="add-item"
                onClick={(e) => openModal(e, `treasureNew`)}
              >
                Add treasure
              </button>
              {currentModal === `treasureNew` && (
                <ItemModal
                  character={character}
                  setCharChangeFlag={setCharChangeFlag}
                  closeModal={closeModal}
                  item={null}
                  isTreasure={true}
                />
              )}
            </div>
          </div>
          {treasure.length === 0 ? <p>-None-</p> : treasure}
          <h1>
            Total:{" "}
            {treasureSums.map(
              (amount, i) =>
                `${i > 0 ? ", " : ""}${amount} ${COIN_CONVERSIONS[i][0]}`
            )}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default CharacterEquipmentTab;
