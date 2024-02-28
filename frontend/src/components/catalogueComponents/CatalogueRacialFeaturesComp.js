import EditRaceModal from "../modals/EditRaceModal";
// takes list and returns JSX with delete and edit buttons on every name
const CatalogueListComp = ({
  itemList,
  handleDelete,
  selectedModal,
  setSelectedModal,
}) => {
  return (
    <>
      {itemList.map((item, i) => (
        <div key={item.name} className="catalogue-item">
          <span onClick={() => setSelectedModal(item._id)}>{item.name}</span>
          <button onClick={() => handleDelete(item._id)}>Delete</button>
          {selectedModal === item._id && <EditRaceModal race={item.name} />}
        </div>
      ))}
    </>
  );
};

export default CatalogueListComp;
