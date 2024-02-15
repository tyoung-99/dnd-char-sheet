import { useState } from "react";
import "../styling/components/MultiColumnDropdownComp.css";

const MultiColumnDropdownComp = ({ buttonText, contents, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && (
        <div
          className="catch-outside-clicks"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      <div className={`dropdown ${isOpen ? "toggled-open" : ""}`}>
        <p className={"dropdown-toggle"} onClick={() => setIsOpen(!isOpen)}>
          {buttonText}
        </p>
        {isOpen && (
          <div className="dropdown-menu">
            {contents.map((col, i) => (
              <div key={i} className="dropdown-column">
                {col.map((elem, j) => (
                  <div
                    key={j}
                    className="dropdown-item"
                    onClick={() => {
                      onSelect(elem);
                      setIsOpen(false);
                    }}
                  >
                    <p>{elem}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MultiColumnDropdownComp;
