// Character's background details/backstory

const CharacterBackgroundTab = ({ character }) => {
  return (
    <div>
      <h1>{character.background.name}</h1>
      {Object.keys(character.background).map((itemName) => {
        if (itemName === "name") {
          return null;
        }
        return <p key={itemName}>{character.background[itemName]}</p>;
      })}
      <h1>Backstory</h1>
      {character.backstory.map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
    </div>
  );
};

export default CharacterBackgroundTab;
