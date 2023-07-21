// Shows character's classes in format Class Level/Class Level...

const InlineClassListComp = ({ classes }) => {
  return (
    <div>
      {classes.map((charClass, i) => (
        <span key={charClass.className}>
          {charClass.className} {charClass.classLevel}
          {i === classes.length - 1 ? null : "/"}
        </span>
      ))}
    </div>
  );
};

export default InlineClassListComp;
