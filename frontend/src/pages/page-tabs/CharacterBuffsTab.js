// Character's current buffs/debuffs

const CharacterBuffsTab = ({ character }) => {
  const parseBuff = (currentBuff, i) => (
    <div key={i}>
      <h1>{currentBuff.name}</h1>
      {currentBuff.desc.map((paragraph, j) => (
        <p key={j}>{paragraph}</p>
      ))}
    </div>
  );

  let buffs = [],
    debuffs = [];

  character.buffs.forEach((currentBuff) => {
    if (currentBuff.isDebuff) debuffs.push(currentBuff);
    else buffs.push(currentBuff);
  });

  buffs = buffs.map(parseBuff);
  debuffs = debuffs.map(parseBuff);

  return (
    <div className="grid-container row-flex">
      <div className="col-1_2 grid-tile">
        {buffs.length > 0 ? buffs : <p>-None-</p>}
      </div>
      <div className="col-1_2 grid-tile">
        {debuffs.length > 0 ? debuffs : <p>-None-</p>}
      </div>
    </div>
  );
};

export default CharacterBuffsTab;
