// Character's racial/class/background features, plus feats

const CharacterAbilitiesTab = ({ character }) => {
  return (
    <div>
      <h1>Race</h1>
      {character.race.traits.map((trait) => (
        <div key={trait.name}>
          <h2>{trait.name}</h2>

          {trait.entries.map((entry) => {
            if (entry.items) {
              return (
                <ul>
                  {entry.items.map((item) => (
                    <li key={item}>
                      <h3>{item.name}</h3>
                      <p>{item.entry}</p>
                    </li>
                  ))}
                </ul>
              );
            }

            return <p key={entry}>{entry}</p>;
          })}
        </div>
      ))}
    </div>
  );
};

export default CharacterAbilitiesTab;
