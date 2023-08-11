// Handles checking/recording input values, updating character
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useCharacter = (character, setCharacter) => {
  const [editing, setEditing] = useState(false);
  const [savePending, setSavePending] = useState(false);

  const [count, setCount] = useState(0);

  const toggleEditing = async () => {
    if (editing) {
      setEditing(false);
    } else {
      setEditing(true);
    }
  };

  const updateCharacter = (newData) => {
    if (!newData) {
      return;
    }

    setSavePending(true);
    setCount(count + 1); // Counter forces timer in useEffect to reset

    console.log(JSON.stringify(newData));

    // ----------------------------------------
    // General Tab
    // ----------------------------------------

    // Name
    if (newData.name) {
      character.name = newData.name;
    }

    // Alignment
    else if (newData.alignment) {
      character.alignment = newData.alignment;
    }

    // Race
    else if (newData.race) {
      character.race.name = newData.race.name;
      character.race.source = newData.race.source;
      character.race.subrace.name = newData.race.subrace.name;
      character.race.subrace.source = newData.race.subrace.source;
    }

    // Background
    else if (newData.background) {
      character.background.name = newData.background.name;
    }

    // Backstory
    else if (newData.backstory) {
      character.backstory = newData.backstory;
    }

    // ----------------------------------------
    // Ability Scores/Proficiencies Tab
    // ----------------------------------------

    // Ability scores
    else if (newData.ability_scores) {
      character.stats.forEach((ability) => {
        ability.score = newData.ability_scores[ability.name];
      });
    }

    // Skill proficiencies
    else if (newData.skill_profs) {
      character.stats.forEach((ability) => {
        ability.skill_profs.forEach((skill) => {
          skill.proficiency = newData.skill_profs[skill.name];
        });
      });
    }

    // Other proficiencies
    // Weapons
    else if (newData.weapon_profs) {
      character.weapon_profs = newData.weapon_profs.filter(
        (prof) => prof !== ""
      );
    }
    // Armor
    else if (newData.armor_profs) {
      character.armor_profs = newData.armor_profs.filter((prof) => prof !== "");
    }
    // Tools
    else if (newData.tool_profs) {
      character.tool_profs = newData.tool_profs.filter((prof) => prof !== "");
    }
    // Languages
    else if (newData.languages) {
      character.languages = newData.languages.filter((prof) => prof !== "");
    }

    // ----------------------------------------
    // Class Tab
    // ----------------------------------------

    // ----------------------------------------
    // Feats Tab
    // ----------------------------------------
  };

  const saveCharacter = useCallback(async () => {
    await axios.put(`/api/characters/${character.id}/update`, {
      newChar: character,
    });

    setCharacter(character);
    setSavePending(false);
  }, [character, setCharacter]);

  useEffect(() => {
    let timer;
    if (savePending) {
      timer = setTimeout(saveCharacter, 5000);
    }
    return () => {
      return clearTimeout(timer);
    };
  }, [savePending, saveCharacter, count]);

  return {
    editing,
    toggleEditing,
    updateCharacter,
    saveCharacter,
    savePending,
  };
};

export default useCharacter;
