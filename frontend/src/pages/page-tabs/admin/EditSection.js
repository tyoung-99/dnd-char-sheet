// Lists/allows editing of a given category of background data
import axios from "axios";
import { useState, useEffect } from "react";

const EditSection = ({ singular, plural, template, EditModal }) => {
  const [items, setItems] = useState();
  const [openModals, setOpenModalsAll] = useState();

  useEffect(() => {
    const loadData = async () => {
      const newItems = (await axios.get(`/api/data/${plural.toLowerCase()}`))
        .data;
      if (typeof newItems === "string" || newItems instanceof String) {
        setItems(newItems);
        return;
      }
      newItems.sort(sortItems);
      setItems(newItems);

      let defaultOpenModals = [];
      newItems.forEach((item) => {
        defaultOpenModals[item.id] = false;
      });
      setOpenModalsAll(defaultOpenModals);
    };
    loadData();
  }, [plural]);

  const sortItems = (first, second) => {
    if (first.name < second.name) {
      return -1;
    }
    if (first.name > second.name) {
      return 1;
    }
    return 0;
  };

  const setOpenModalOne = (event) => {
    const itemID = event.target.id;
    const newOpenModals = { ...openModals };
    newOpenModals[itemID] = true;
    setOpenModalsAll(newOpenModals);
  };

  const closeModal = (openItemID) => {
    const newOpenModals = { ...openModals };
    newOpenModals[openItemID] = false;
    setOpenModalsAll(newOpenModals);
  };

  const updateItem = async (newItem) => {
    const response = await axios.put(
      `/api/data/${plural.toLowerCase()}/update`,
      {
        newData: newItem,
      }
    );

    const newItems = response.data;
    newItems.sort(sortItems);
    setItems(newItems);
  };

  const addItem = async () => {
    const newItems = [...items];

    const response = await axios.put(`/api/data/${plural.toLowerCase()}/add`, {
      newData: template,
    });

    newItems.push(response.data);
    newItems.sort(sortItems);
    setItems(newItems);
  };

  const removeItem = async (remove) => {
    const response = await axios.put(
      `/api/data/${plural.toLowerCase()}/remove`,
      {
        newData: remove,
      }
    );

    const newItems = response.data;
    newItems.sort(sortItems);
    setItems(newItems);
  };

  if (!items) {
    return <div>Loading...</div>;
  }

  if (typeof items === "string" || items instanceof String) {
    return <div>{items}</div>;
  }

  return (
    <div>
      <button onClick={addItem}>Add {singular}</button>
      {items.map((item) => (
        <div key={item.id}>
          <h2 className="edit-link" id={item.id} onClick={setOpenModalOne}>
            {item.name !== "" ? item.name : `Unnamed ${singular}`}
          </h2>
          {openModals[item.id] && (
            <EditModal
              item={item}
              closeModal={closeModal}
              updateItem={updateItem}
              removeItem={removeItem}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default EditSection;
