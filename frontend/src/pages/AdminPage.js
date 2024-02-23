import { useState } from "react";
import TabNavComp from "../components/TabNavComp";
import TabContentComp from "../components/TabContentComp";
import AdminClassesTab from "./admin-page-tabs/AdminClassesTab";
import AdminRacesTab from "./admin-page-tabs/AdminRacesTab";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("classes");
  // const [activeModal, setActiveModal] = useState("");

  return (
    <>
      <ul className="nav">
        <TabNavComp
          id={"classes"}
          tabName={"Classes"}
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
          id={"items"}
          tabName={"Items"}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </ul>
      <div>
        <TabContentComp id={"classes"} activeTab={activeTab}>
          <AdminClassesTab />
        </TabContentComp>
        <TabContentComp id={"races"} activeTab={activeTab}>
          <AdminRacesTab />
        </TabContentComp>
      </div>
    </>
  );
};

export default AdminPage;
