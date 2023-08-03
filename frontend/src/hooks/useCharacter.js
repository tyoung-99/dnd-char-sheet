// Handles checking/recording input values, updating character
import { useState } from "react";
import axios from "axios";

const useCharacter = ({ character, setCharacter }) => {
  const [editing, setEditing] = useState(false);

  const toggleEditing = async () => {
    if (editing) {
      setEditing(false);
    } else {
      setEditing(true);
    }
  };

  const saveCharacter = async () => {
    const inputs = document.querySelectorAll("input");

    inputs.forEach((inputField) => {
      if (inputField.getAttribute("data-section") === "stats") {
        // Ability scores
        if (inputField.getAttribute("data-type") === "score") {
          character.stats.find(
            (ability) =>
              ability.name === inputField.getAttribute("data-ability")
          ).score = inputField.value;
        }

        // Skill proficiencies
        else if (inputField.getAttribute("data-type") === "skill") {
          const newProf =
            inputField.value === "None"
              ? 0
              : inputField.value === "Proficient"
              ? 1
              : 2;

          character.stats
            .find(
              (ability) =>
                ability.name === inputField.getAttribute("data-ability")
            )
            .skill_profs.find(
              (skill) => skill.name === inputField.getAttribute("data-skill")
            ).proficiency = newProf;
        }
      }
    });

    await axios.put(`/api/characters/${character.id}/update`, {
      newChar: character,
    });

    setCharacter(character);
  };

  return { editing, toggleEditing, saveCharacter };
};

export default useCharacter;
