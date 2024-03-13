// Shows current XP, allows adjusting amount of XP, displays messages regarding available level ups/inconsistencies in amount of XP

import NumInputComp from "./NumInputComp";

const XpComp = ({ character }) => {
  const XP_THRESHOLDS = [
    0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, 100000,
    120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000,
  ];

  const charLevel = character.classes.reduce(
    (totalLevel, charClass) => totalLevel + charClass.classLevel,
    0
  );

  const addXp = (amount) => {
    character.setXp((character.xp.amount += amount));
  };

  return (
    <div>
      {character.xp.amount < XP_THRESHOLDS[charLevel - 1] && (
        <img
          src={process.env.PUBLIC_URL + "/icons/danger.png"}
          alt="Not enough XP for current level"
          title="Not enough XP for current level"
          className="hover-icon"
        ></img>
      )}
      {character.xp.amount >= XP_THRESHOLDS[charLevel] && (
        <img
          src={process.env.PUBLIC_URL + "/icons/up_arrow.png"}
          alt="Level up available"
          title="Level up available"
          className="hover-icon"
        ></img>
      )}
      <p>XP: {character.xp.amount}</p>
      <NumInputComp buttonText={"+"} callback={addXp} />
    </div>
  );
};

export default XpComp;
