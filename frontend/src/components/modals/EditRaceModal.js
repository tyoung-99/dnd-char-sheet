// Popup for editing 1 race
import "../../styling/EditDataModal.css";
import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { TreeView } from "@mui/x-tree-view/TreeView";
import CustomTreeItem from "../CustomTreeItem";
import DynamicTextArea from "../DynamicTextArea";

const EditRaceModal = ({ item, closeModal, updateItem, removeItem }) => {
  const [newRace, setNewRace] = useState(item);

  const queueChange = (event) => {
    const inputField = event.target;
    const raceSrcIndex = inputField.getAttribute("data-race-src-index");
    const raceTraitIndex = inputField.getAttribute("data-race-trait-index");
    const subraceIndex = inputField.getAttribute("data-subrace-index");
    const subraceSrcIndex = inputField.getAttribute("data-subrace-src-index");
    const subraceTraitIndex = inputField.getAttribute(
      "data-subrace-trait-index"
    );

    const raceChange = structuredClone(newRace);

    switch (inputField.name) {
      case "race-name":
        raceChange.name = inputField.value;
        break;
      case "race-src-name":
        raceChange.sources[raceSrcIndex].name = inputField.value;
        break;
      case "race-trait-name":
        raceChange.sources[raceSrcIndex].traits[raceTraitIndex].name =
          inputField.value;
        break;
      case "race-trait-desc":
        raceChange.sources[raceSrcIndex].traits[raceTraitIndex].description =
          inputField.value;
        break;
      case "subrace-name":
        raceChange.sources[raceSrcIndex].subraces[subraceIndex].name =
          inputField.value;
        break;
      case "subrace-src-name":
        raceChange.sources[raceSrcIndex].subraces[subraceIndex].sources[
          subraceSrcIndex
        ].name = inputField.value;
        break;
      case "subrace-trait-name":
        raceChange.sources[raceSrcIndex].subraces[subraceIndex].sources[
          subraceSrcIndex
        ].traits[subraceTraitIndex].name = inputField.value;
        break;
      case "subrace-trait-desc":
        raceChange.sources[raceSrcIndex].subraces[subraceIndex].sources[
          subraceSrcIndex
        ].traits[subraceTraitIndex].description = inputField.value;
        break;
      default:
        console.log(`Unexpected input field name: ${inputField.name}`);
        break;
    }

    setNewRace(raceChange);
  };

  const addSection = (event) => {
    const button = event.target;
    const raceSrcIndex = button.getAttribute("data-race-src-index");
    const subraceIndex = button.getAttribute("data-subrace-index");
    const subraceSrcIndex = button.getAttribute("data-subrace-src-index");

    const raceChange = structuredClone(newRace);

    switch (button.name) {
      case "race-src":
        raceChange.sources.push({
          name: "New Source",
          traits: [],
          subraces: [],
        });
        break;
      case "race-trait":
        raceChange.sources[raceSrcIndex].traits.push({
          name: "New Trait",
          description: "",
        });
        break;
      case "subrace":
        raceChange.sources[raceSrcIndex].subraces.push({
          name: "New Subrace",
          sources: [
            {
              name: "New Source",
              traits: [],
              subraces: [],
            },
          ],
        });
        break;
      case "subrace-src":
        raceChange.sources[raceSrcIndex].subraces[subraceIndex].sources.push({
          name: "New Source",
          traits: [],
          subraces: [],
        });
        break;
      case "subrace-trait":
        raceChange.sources[raceSrcIndex].subraces[subraceIndex].sources[
          subraceSrcIndex
        ].traits.push({
          name: "New Trait",
          description: "",
        });
        break;
      default:
        console.log(`Unexpected button name: ${button.name}`);
    }

    setNewRace(raceChange);
  };

  const removeSection = (event) => {
    const button = event.target;
    const raceSrcIndex = button.getAttribute("data-race-src-index");
    const raceTraitIndex = button.getAttribute("data-race-trait-index");
    const subraceIndex = button.getAttribute("data-subrace-index");
    const subraceSrcIndex = button.getAttribute("data-subrace-src-index");
    const subraceTraitIndex = button.getAttribute("data-subrace-trait-index");

    const raceChange = structuredClone(newRace);

    switch (button.name) {
      case "race-src":
        raceChange.sources.splice(raceSrcIndex, 1);
        break;
      case "race-trait":
        raceChange.sources[raceSrcIndex].traits.splice(raceTraitIndex, 1);
        break;
      case "subrace":
        raceChange.sources[raceSrcIndex].subraces.splice(subraceIndex, 1);
        break;
      case "subrace-src":
        raceChange.sources[raceSrcIndex].subraces[subraceIndex].sources.splice(
          subraceSrcIndex,
          1
        );
        break;
      case "subrace-trait":
        raceChange.sources[raceSrcIndex].subraces[subraceIndex].sources[
          subraceSrcIndex
        ].traits.splice(subraceTraitIndex, 1);
        break;
      default:
        console.log(`Unexpected button name: ${button.name}`);
    }

    setNewRace(raceChange);
  };

  const confirmDelete = (event) => {
    const button = event.target;
    const raceSrcIndex = button.getAttribute("data-race-src-index");
    const raceTraitIndex = button.getAttribute("data-race-trait-index");
    const subraceIndex = button.getAttribute("data-subrace-index");
    const subraceSrcIndex = button.getAttribute("data-subrace-src-index");
    const subraceTraitIndex = button.getAttribute("data-subrace-trait-index");

    let componentName;
    switch (button.name) {
      case "delete-race":
        componentName = newRace.name;
        break;
      case "race-src":
        componentName = newRace.sources[raceSrcIndex].name;
        break;
      case "race-trait":
        componentName =
          newRace.sources[raceSrcIndex].traits[raceTraitIndex].name;
        break;
      case "subrace":
        componentName =
          newRace.sources[raceSrcIndex].subraces[subraceIndex].name;
        break;
      case "subrace-src":
        componentName =
          newRace.sources[raceSrcIndex].subraces[subraceIndex].sources[
            subraceSrcIndex
          ].name;
        break;
      case "subrace-trait":
        componentName =
          newRace.sources[raceSrcIndex].subraces[subraceIndex].sources[
            subraceSrcIndex
          ].traits[subraceTraitIndex].name;
        break;
      default:
        console.log(`Unexpected component name: ${button.name}`);
    }

    if (
      window.confirm(
        `Are you sure you want to delete ${componentName} and all its contained data? This cannot be undone.`
      )
    ) {
      if (button.name === "delete-race") {
        removeItem(newRace);
        closeModal(newRace.id);
      } else {
        removeSection(event);
      }
    }
  };

  return (
    <div className="modal-background">
      <div className="modal-container">
        <div className="header">
          <input
            name="race-name"
            onChange={queueChange}
            placeholder="Race Name"
            value={newRace.name}
          ></input>
        </div>
        <div className="body">
          <TreeView
            aria-label="race editor"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            sx={{ width: 0.9 }}
          >
            <CustomTreeItem
              nodeId={`add-race-src`}
              label={
                <button name="race-src" onClick={addSection}>
                  Add Source
                </button>
              }
            ></CustomTreeItem>
            {newRace.sources.map((src, i) => (
              <CustomTreeItem
                key={`race-src-${i}`}
                nodeId={`race-src-${i}`}
                label={
                  <div className="row-flex deletable">
                    <input
                      name="race-src-name"
                      data-race-src-index={i}
                      onChange={queueChange}
                      placeholder="Source Name"
                      value={src.name}
                    ></input>
                    <button
                      name="race-src"
                      data-race-src-index={i}
                      className="delete-button"
                      onClick={confirmDelete}
                    >
                      X
                    </button>
                  </div>
                }
              >
                <CustomTreeItem nodeId={`race-src-${i}-traits`} label="Traits">
                  <CustomTreeItem
                    nodeId={`add-race-src-${i}-trait`}
                    label={
                      <button
                        name="race-trait"
                        data-race-src-index={i}
                        onClick={addSection}
                      >
                        Add Trait
                      </button>
                    }
                  ></CustomTreeItem>
                  {src.traits.map((trait, j) => (
                    <CustomTreeItem
                      key={`race-src-${i}-trait-${j}`}
                      nodeId={`race-src-${i}-trait-${j}`}
                      label={
                        <div className="row-flex deletable">
                          <div className="">
                            <input
                              name="race-trait-name"
                              data-race-src-index={i}
                              data-race-trait-index={j}
                              onChange={queueChange}
                              placeholder="Trait Name"
                              value={trait.name}
                            ></input>
                            <DynamicTextArea
                              name="race-trait-desc"
                              data-race-src-index={i}
                              data-race-trait-index={j}
                              onChange={queueChange}
                              placeholder="Trait Description"
                              value={trait.description}
                              className="locked-textarea"
                            />
                          </div>
                          <button
                            name="race-trait"
                            data-race-src-index={i}
                            data-race-trait-index={j}
                            className="delete-button"
                            onClick={confirmDelete}
                          >
                            X
                          </button>
                        </div>
                      }
                    ></CustomTreeItem>
                  ))}
                </CustomTreeItem>
                <CustomTreeItem
                  nodeId={`race-src-${i}-subraces`}
                  label="Subraces"
                >
                  <CustomTreeItem
                    nodeId={`add-race-src-${i}-subrace`}
                    label={
                      <button
                        name="subrace"
                        data-race-src-index={i}
                        onClick={addSection}
                      >
                        Add Subrace
                      </button>
                    }
                  ></CustomTreeItem>
                  {src.subraces.map((subrace, j) => (
                    <CustomTreeItem
                      key={`race-src-${i}-subrace-${j}`}
                      nodeId={`race-src-${i}-subrace-${j}`}
                      label={
                        <div className="row-flex deletable">
                          <input
                            name="subrace-name"
                            data-race-src-index={i}
                            data-subrace-index={j}
                            onChange={queueChange}
                            placeholder="Subrace Name"
                            value={subrace.name}
                          ></input>
                          <button
                            name="subrace"
                            data-race-src-index={i}
                            data-subrace-index={j}
                            className="delete-button"
                            onClick={confirmDelete}
                          >
                            X
                          </button>
                        </div>
                      }
                    >
                      <CustomTreeItem
                        nodeId={`add-race-src-${i}-subrace-${j}-src`}
                        label={
                          <button
                            name="subrace-src"
                            data-race-src-index={i}
                            data-subrace-index={j}
                            onClick={addSection}
                          >
                            Add Source
                          </button>
                        }
                      ></CustomTreeItem>
                      {subrace.sources.map((subSrc, k) => (
                        <CustomTreeItem
                          key={`race-src-${i}-subrace-${j}-src-${k}`}
                          nodeId={`race-src-${i}-subrace-${j}-src-${k}`}
                          label={
                            <div className="row-flex deletable">
                              <input
                                name="subrace-src-name"
                                data-race-src-index={i}
                                data-subrace-index={j}
                                data-subrace-src-index={k}
                                onChange={queueChange}
                                placeholder="Source Name"
                                value={subSrc.name}
                              ></input>
                              <button
                                name="subrace-src"
                                data-race-src-index={i}
                                data-subrace-index={j}
                                data-subrace-src-index={k}
                                className="delete-button"
                                onClick={confirmDelete}
                              >
                                X
                              </button>
                            </div>
                          }
                        >
                          <CustomTreeItem
                            nodeId={`add-race-src-${i}-subrace-${j}-trait`}
                            label={
                              <button
                                name="subrace-trait"
                                data-race-src-index={i}
                                data-subrace-index={j}
                                data-subrace-src-index={k}
                                onClick={addSection}
                              >
                                Add Trait
                              </button>
                            }
                          ></CustomTreeItem>
                          {subSrc.traits.map((subTrait, l) => (
                            <CustomTreeItem
                              key={`race-src-${i}-subrace-${j}-src-${k}-trait-${l}`}
                              nodeId={`race-src-${i}-subrace-${j}-src-${k}-trait-${l}`}
                              label={
                                <div className="row-flex deletable">
                                  <div>
                                    <input
                                      name="subrace-trait-name"
                                      data-race-src-index={i}
                                      data-subrace-index={j}
                                      data-subrace-src-index={k}
                                      data-subrace-trait-index={l}
                                      onChange={queueChange}
                                      placeholder="Trait Name"
                                      value={subTrait.name}
                                    ></input>
                                    <DynamicTextArea
                                      name="subrace-trait-desc"
                                      data-race-src-index={i}
                                      data-subrace-index={j}
                                      data-subrace-src-index={k}
                                      data-subrace-trait-index={l}
                                      onChange={queueChange}
                                      placeholder="Trait Description"
                                      value={subTrait.description}
                                      className="locked-textarea"
                                    />
                                  </div>
                                  <button
                                    name="subrace-trait"
                                    data-race-src-index={i}
                                    data-subrace-index={j}
                                    data-subrace-src-index={k}
                                    data-subrace-trait-index={l}
                                    className="delete-button"
                                    onClick={confirmDelete}
                                  >
                                    X
                                  </button>
                                </div>
                              }
                            ></CustomTreeItem>
                          ))}
                        </CustomTreeItem>
                      ))}
                    </CustomTreeItem>
                  ))}
                </CustomTreeItem>
              </CustomTreeItem>
            ))}
          </TreeView>
        </div>
        <div className="footer">
          <button
            onClick={() => {
              closeModal(newRace.id);
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              updateItem(newRace);
              closeModal(newRace.id);
            }}
          >
            Save
          </button>
          <button
            name="delete-race"
            className="warn-button"
            onClick={confirmDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditRaceModal;
