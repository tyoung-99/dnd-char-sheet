// Shows character's classes in format Class Level/Class Level...

const InlineClassListComp = ({ classes }) => {
  return (
    <p>
      {classes.map((charClass, i) => (
        <span key={charClass.class_name}>
          {charClass.class_name} {charClass.class_level}
          {i === classes.length - 1 ? null : "/"}
        </span>
      ))}
    </p>
  );
};

export default InlineClassListComp;
