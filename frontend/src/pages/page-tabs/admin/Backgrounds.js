import EditSection from "./EditSection";
import EditBackgroundModal from "../../../components/modals/EditBackgroundModal";

const Backgrounds = () => {
  return (
    <div className="admin">
      <div className="admin-col">
        <h1>Backgrounds</h1>
        <EditSection
          singular={"Background"}
          plural={"Backgrounds"}
          template={{
            name: "New Background",
            source: "",
            features: [
              {
                name: "",
                description: "",
                copyFrom: null,
              },
            ],
            characeristics: {
              copyFrom: null,
              traits: [""],
              ideals: [""],
              bonds: [""],
              flaws: [""],
            },
          }}
          EditModal={EditBackgroundModal}
        />
      </div>
    </div>
  );
};
export default Backgrounds;
