// Content of tab w/in a page, displays self if tab selected

const TabContentComp = ({ id, activeTab, children }) => {
  return activeTab === id ? <div className="TabContent">{children}</div> : null;
};

export default TabContentComp;
