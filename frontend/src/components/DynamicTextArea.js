// Textarea that dynamically resizes to fit its contents

import { useEffect, useState, useRef } from "react";

const DynamicTextArea = (props) => {
  const [val, setVal] = useState(props.defaultValue);
  const textAreaRef = useRef(null);

  const resize = () => {
    textAreaRef.current.style.height = "auto";
    textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
  };

  useEffect(resize, [val]);

  const handleChange = (event) => {
    setVal(event.target.value);
    if (props.onChange) {
      props.onChange(event);
    }
  };

  const newProps = {
    ...props,
    ...{ ref: textAreaRef, onChange: handleChange },
  };
  const text = <textarea {...newProps} />;

  return text;
};

export default DynamicTextArea;
