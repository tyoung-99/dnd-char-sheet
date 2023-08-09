// Tab w/in a page, toggles on if clicked

const TabNavComp = ({
  id,
  tabName,
  activeTab,
  setActiveTab,
  callback = () => {},
}) => {
  const handleClick = () => {
    callback();
    setActiveTab(id);
  };

  return (
    <li onClick={handleClick} className={activeTab === id ? "active" : ""}>
      {tabName}
    </li>
  );
};

export default TabNavComp;
