import { useState, useEffect } from "react";

const CharacterBackstoryComp = ({
  character,
  charChangeFlag,
  setCharChangeFlag,
  openModal,
  closeModal,
  currentModal,
}) => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [backstory, setBackstory] = useState();

  useEffect(() => {
    setBackstory(character.backstory);
    setDataLoaded(true);
  }, [character, charChangeFlag]);

  if (!dataLoaded)
    return (
      <div className="grid-tile">
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="grid-tile">
      <h1>Backstory</h1>
      {backstory.map((paragraph, i) => (
        <p key={i} className="text-block">
          {paragraph}
        </p>
      ))}
    </div>
  );
};

export default CharacterBackstoryComp;
