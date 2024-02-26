// takes list and returns JSX with delete and edit buttons on every name
const CatalogueListComp = ({ itemList, handleDelete }) => (
  <>
    {itemList.map((item, i) => (
      <div key={item.name} className="catalogue-item">
        <span>{item.name}</span>
        <button onClick={() => handleDelete(item._id)}>Delete</button>
      </div>
    ))}
  </>
);

export default CatalogueListComp;
