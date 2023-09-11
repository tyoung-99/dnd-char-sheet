import React, { useState } from "react";

const ToggleVisibility = ({ label, defaultShow, type, children }) => {
  const [show, setShow] = useState(defaultShow);

  return (
    <React.Fragment>
      <h1 className={type} onClick={() => setShow(!show)}>
        {label}
      </h1>
      {show && children}
    </React.Fragment>
  );
};

export default ToggleVisibility;
