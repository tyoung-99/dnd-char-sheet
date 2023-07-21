// Character's background details/backstory

const CharacterBackgroundTab = ({ character }) => {
  return (
    <div className="backstory">
      {character.backstory.map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
    </div>
  );
};

export default CharacterBackgroundTab;
