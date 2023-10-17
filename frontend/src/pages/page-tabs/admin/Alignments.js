import EditSection from "./EditSection";
import EditAlignmentModal from "../../../components/modals/EditAlignmentModal";

const Alignments = () => {
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
    </div>
  );
};
export default Alignments;
