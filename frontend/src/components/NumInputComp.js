// Generic component for entering a number to be used in a given callback function

import "../styling/components/NumInputComp.css";
import { useState, useRef } from "react";

const NumInputComp = ({ buttonText, callback, alignLeft }) => {
  const [isOpen, setIsOpen] = useState(false);
  const input = useRef(null);

  const handleInput = () => {
    const inputAmount = parseInt(input.current.value);
    callback(inputAmount);
    setIsOpen(false);
  };

  return (
    <>
      <button
        id="toggleOpen"
        name="toggleOpen"
        onClick={() => setIsOpen(!isOpen)}
      >
        {buttonText}
      </button>
      {isOpen && (
        <>
          <div
            className="catch-outside-clicks"
            onClick={() => setIsOpen(false)}
          ></div>
          <div
            className={`num-input-popup ${
              alignLeft
                ? "num-input-popup-align-left"
                : "num-input-popup-align-right"
            }`}
          >
            <input
              type="number"
              id="inputAmount"
              name="inputAmount"
              defaultValue={0}
              autoFocus
              onFocus={(event) => {
                event.target.select();
              }}
              ref={input}
              onKeyUp={(event) => {
                if (event.key === "Enter") handleInput();
              }}
            ></input>
            <input
              type="button"
              id="submit"
              name="submit"
              value="Apply"
              onClick={handleInput}
            ></input>
          </div>
        </>
      )}
    </>
  );
};

export default NumInputComp;
