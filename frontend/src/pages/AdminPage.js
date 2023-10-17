// Allows viewing/editing background data on races, classes, etc.
import "../styling/AdminPage.css";
import { useState } from "react";
import TabNavComp from "../components/TabNavComp";
import TabContentComp from "../components/TabContentComp";
import Alignments from "./page-tabs/admin/Alignments";
import Races from "./page-tabs/admin/Races";
import Backgrounds from "./page-tabs/admin/Backgrounds";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("alignments");

  return (
    <>
      <ul className="nav">
        <TabNavComp
          id={"alignments"}
          tabName={"Alignments"}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <TabNavComp
          id={"races"}
          tabName={"Races"}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <TabNavComp
          id={"backgrounds"}
          tabName={"Backgrounds"}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </ul>
      <div>
        <TabContentComp id={"alignments"} activeTab={activeTab}>
          <Alignments />
        </TabContentComp>
        <TabContentComp id={"races"} activeTab={activeTab}>
          <Races />
        </TabContentComp>
        <TabContentComp id={"backgrounds"} activeTab={activeTab}>
          <Backgrounds />
        </TabContentComp>
      </div>
    </>
  );
};

export default AdminPage;
