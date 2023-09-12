// Character's racial/class/background features, plus feats

const CharacterAbilitiesTab = ({ character }) => {
  return (
    <div>
      <h1>Race</h1>
      {character.race.traits.map((trait) => (
        <div key={trait.name}>
          <h2>{trait.name}</h2>
          <p>{trait.description}</p>
        </div>
      ))}
    </div>
  );
};

export default CharacterAbilitiesTab;
