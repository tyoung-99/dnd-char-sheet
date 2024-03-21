import { useState } from "react";
import "../styling/components/Collapsible.css";

const Collapsible = ({ open, children, title }) => {
  const [isOpen, setIsOpen] = useState(open);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button className="collapsibleCard" onClick={() => toggleOpen()}>
        <div className="row-flex collapsibleHeading">
          <div className="collapsibleTitle">{title}</div>
          <div className="collapsibleOpenIcon">{isOpen ? "-" : "+"}</div>
        </div>
        <div className="collapsibleContent">{isOpen && children}</div>
      </button>
    </>
  );
};

export default Collapsible;
