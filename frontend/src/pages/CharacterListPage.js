import "../styling/CharacterListPage.css";
import CharacterListComp from "../components/CharacterListComp";
import characters from "../sample-data/CharactersContentSample";

// Show user preliminary details about their characters
const CharacterListPage = () => {
  return (
    <>
      <h1>Characters</h1>
      <CharacterListComp characters={characters} />
    </>
  );
};

export default CharacterListPage;
