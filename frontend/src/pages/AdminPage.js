// Allows viewing/editing background data on races, classes, etc.
import "../styling/AdminPage.css";
import EditSection from "./page-tabs/admin/EditSection";
import EditAlignmentModal from "../components/modals/EditAlignmentModal";
import EditRaceModal from "../components/modals/EditRaceModal";
import EditBackgroundModal from "../components/modals/EditBackgroundModal";

const AdminPage = () => {
  return (
    <div className="admin">
      <div className="admin-col">
        <h1>Alignments</h1>
        <EditSection
          singular={"Alignment"}
          plural={"Alignments"}
          template={{ name: "New Alignment" }}
          EditModal={EditAlignmentModal}
        />
      </div>
      <div className="admin-col">
        <h1>Races</h1>
        <EditSection
          singular={"Race"}
          plural={"Races"}
          template={{
            name: "New Race",
            sources: [
              {
                name: "New Source",
                traits: [],
                subraces: [],
              },
            ],
          }}
          EditModal={EditRaceModal}
        />
      </div>
      <div className="admin-col">
        <h1>Backgrounds</h1>
        <EditSection
          singular={"Background"}
          plural={"Backgrounds"}
          template={{
            name: "New Background",
            source: "",
            personalityTrait1: "",
            personalityTrait2: "",
            ideal: "",
            bond: "",
            flaw: "",
          }}
          EditModal={EditBackgroundModal}
        />
      </div>
    </div>
  );
};

export default AdminPage;
