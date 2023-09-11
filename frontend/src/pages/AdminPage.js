// Allows viewing/editing background data on races, classes, etc.
import "../styling/AdminPage.css";
import EditRaces from "./page-tabs/admin/EditRaces";
import EditBackgrounds from "./page-tabs/admin/EditBackgrounds";

const AdminPage = () => {
  return (
    <div className="admin">
      <div className="admin-col">
        <h1>Races</h1>
        <EditRaces />
      </div>
      <div className="admin-col">
        <h1>Backgrounds</h1>
        <EditBackgrounds />
      </div>
    </div>
  );
};

export default AdminPage;
