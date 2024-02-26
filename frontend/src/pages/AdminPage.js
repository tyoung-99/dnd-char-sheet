import { useState } from "react";
import TabNavComp from "../components/TabNavComp";
import TabContentComp from "../components/TabContentComp";
import AdminClassesTab from "./admin-page-tabs/AdminClassesTab";
import AdminRacesTab from "./admin-page-tabs/AdminRacesTab";
import { Link } from "react-router-dom";
import "../styling/pages/AdminPage.css";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("classes");
  // const [activeModal, setActiveModal] = useState("");

  return (
    <>
      <Link to="/">
        <input
          type="button"
          id="charListLink"
          name="charListLink"
          value="< Back to List"
        ></input>
      </Link>
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
