import EditRaceFeatureModal from "../modals/adminModals/EditRaceFeatureModal";
// takes list and returns JSX with delete and edit buttons on every name
const CatalogueRacialFeaturesComp = ({
  racialFeatures,
  handleDelete,
  currentModal,
  setCurrentModal,
  closeModal,
}) => {
  return (
    <>
      {racialFeatures.map((racFeat, i) => (
        <div key={racFeat.name} className="catalogue-item">
          <span onClick={() => setCurrentModal(racFeat._id)}>
            {racFeat.name}
          </span>
          <button onClick={() => handleDelete(racFeat._id)}>Delete</button>
          {currentModal === racFeat._id && (
            <EditRaceFeatureModal
              racialFeature={racFeat}
              closeModal={closeModal}
            />
          )}
        </div>
      ))}
    </>
  );
};

export default CatalogueRacialFeaturesComp;
