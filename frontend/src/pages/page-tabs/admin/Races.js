import EditSection from "./EditSection";
import EditRaceModal from "../../../components/modals/EditRaceModal";

const Races = () => {
  return (
    <div className="admin">
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
    </div>
  );
};
export default Races;
