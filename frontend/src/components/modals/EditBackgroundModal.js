// Popup for editing 1 overall background
import "../../styling/EditDataModal.css";
import axios from "axios";
import { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { TreeView } from "@mui/x-tree-view/TreeView";
import CustomTreeItem from "../CustomTreeItem";
import DynamicTextArea from "../DynamicTextArea";

const EditBackgroundModal = ({ item, closeModal, updateItem, removeItem }) => {
  const [newBackground, setNewBackground] = useState(item);
  const [backgroundsList, setBackgroundsList] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const newBackgroundsList = (await axios.get(`/api/data/backgrounds`))
        .data;
      setBackgroundsList(newBackgroundsList);
    };
    loadData();
  }, []);

  const queueChange = (event) => {
    const inputField = event.target;
    const featureIndex = inputField.getAttribute(
      "data-background-feature-index"
    );
    const traitIndex = inputField.getAttribute("data-background-trait-index");
    const idealIndex = inputField.getAttribute("data-background-ideal-index");
    const bondIndex = inputField.getAttribute("data-background-bond-index");
    const flawIndex = inputField.getAttribute("data-background-flaw-index");

    const backgroundChange = structuredClone(newBackground);

    switch (inputField.name) {
      case "background-name":
        backgroundChange.name = inputField.value;
        break;
      case "background-src":
        backgroundChange.source = inputField.value;
        break;
      case "background-feature-name":
        backgroundChange.features[featureIndex].name = inputField.value;
        break;
      case "background-feature-desc":
        backgroundChange.features[featureIndex].description = inputField.value;
        break;
      case "background-feature-copy":
        if (backgroundChange.features[featureIndex].copyFrom) {
          backgroundChange.features[featureIndex].copyFrom = null;
          break;
        }
        backgroundChange.features[featureIndex].copyFrom = {
          copyBackground: -1,
          copyFeature: -1,
        };
        break;
      case "copy-background":
        backgroundChange.features[featureIndex].copyFrom.copyBackground =
          parseInt(inputField.value);
        break;
      case "copy-feature":
        backgroundChange.features[featureIndex].copyFrom.copyFeature = parseInt(
          inputField.value
        );
        break;
      case "background-characteristics-copy":
        if (
          backgroundChange.characteristics.copyFrom ||
          backgroundChange.characteristics.copyFrom === 0
        ) {
          backgroundChange.characteristics.copyFrom = null;
          break;
        }
        backgroundChange.characteristics.copyFrom = -1;
        break;
      case "copy-characteristics":
        backgroundChange.characteristics.copyFrom = parseInt(inputField.value);
        break;
      case "background-trait":
        backgroundChange.traits[traitIndex] = inputField.value;
        break;
      case "background-ideal":
        backgroundChange.ideals[idealIndex] = inputField.value;
        break;
      case "background-bond":
        backgroundChange.bonds[bondIndex] = inputField.value;
        break;
      case "background-flaw":
        backgroundChange.flaws[flawIndex] = inputField.value;
        break;
      default:
        window.alert(`Unexpected input field name: ${inputField.name}`);
    }

    setNewBackground(backgroundChange);
  };

  const addSection = (event) => {
    const button = event.target;

    const backgroundChange = structuredClone(newBackground);

    switch (button.name) {
      case "background-feature":
        const nextID = backgroundChange.features.slice(-1)[0].id + 1;
        backgroundChange.features.push({
          name: "",
          description: "",
          copyFrom: null,
          id: nextID,
        });
        break;
      case "background-trait":
        backgroundChange.traits.push("");
        break;
      case "background-ideal":
        backgroundChange.ideals.push("");
        break;
      case "background-bond":
        backgroundChange.bonds.push("");
        break;
      case "background-flaw":
        backgroundChange.flaws.push("");
        break;
      default:
        window.alert(`Unexpected button name: ${button.name}`);
    }

    setNewBackground(backgroundChange);
  };

  const removeSection = (event) => {
    const button = event.target;
    const featureIndex = button.getAttribute("data-background-feature-index");
    const traitIndex = button.getAttribute("data-background-trait-index");
    const idealIndex = button.getAttribute("data-background-ideal-index");
    const bondIndex = button.getAttribute("data-background-bond-index");
    const flawIndex = button.getAttribute("data-background-flaw-index");

    const backgroundChange = structuredClone(newBackground);

    switch (button.name) {
      case "background-feature":
        backgroundChange.features.splice(featureIndex, 1);
        break;
      case "background-trait":
        backgroundChange.traits.splice(traitIndex, 1);
        break;
      case "background-ideal":
        backgroundChange.ideals.splice(idealIndex, 1);
        break;
      case "background-bond":
        backgroundChange.bonds.splice(bondIndex, 1);
        break;
      case "background-flaw":
        backgroundChange.flaws.splice(flawIndex, 1);
        break;
      default:
        window.alert(`Unexpected button name: ${button.name}`);
    }

    setNewBackground(backgroundChange);
  };

  const confirmDelete = (event) => {
    const button = event.target;

    if (
      window.confirm(
        `Are you sure you want to delete this item and all its contained data? This cannot be undone.`
      )
    ) {
      if (button.name === "delete-background") {
        removeItem(newBackground);
        closeModal(newBackground.id);
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
            type="text"
            name="background-name"
            onChange={queueChange}
            placeholder="Background Name"
            value={newBackground.name}
          ></input>
        </div>
        <div className="body col-flex">
          <div className="row-flex col-12">
            <label htmlFor="background-src" className="col-3">
              Source
            </label>
            <input
              type="text"
              id="background-src"
              name="background-src"
              onChange={queueChange}
              value={newBackground.source}
            ></input>
          </div>
          <TreeView
            aria-label="background editor"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            sx={{ width: 1 }}
          >
            <CustomTreeItem
              nodeId={`background-features-list`}
              label={<div>Features</div>}
            >
              <CustomTreeItem
                nodeId={`add-background-feature`}
                label={
                  <button name="background-feature" onClick={addSection}>
                    Add Feature
                  </button>
                }
              ></CustomTreeItem>
              {newBackground.features.map((feature, i) => (
                <CustomTreeItem
                  key={`background-feature-${i}`}
                  nodeId={`background-feature-${i}`}
                  label={
                    <div className="row-flex">
                      <div className="col-flex col-12">
                        <input
                          type="text"
                          name="background-feature-name"
                          data-background-feature-index={i}
                          onChange={queueChange}
                          placeholder="Feature Name"
                          value={
                            !feature.copyFrom ? feature.name : "Copied feature"
                          }
                          disabled={feature.copyFrom}
                        ></input>
                        <DynamicTextArea
                          name="background-feature-desc"
                          data-background-feature-index={i}
                          onChange={queueChange}
                          placeholder="Feature Description"
                          value={
                            !feature.copyFrom
                              ? feature.description
                              : "Copied feature"
                          }
                          disabled={feature.copyFrom}
                          className="locked-textarea"
                        />
                        <div className="row-flex">
                          <input
                            type="checkbox"
                            id={`background-feature-${i}-copy`}
                            name="background-feature-copy"
                            data-background-feature-index={i}
                            defaultChecked={feature.copyFrom}
                            onChange={queueChange}
                          ></input>
                          <label htmlFor={`background-feature-${i}-copy`}>
                            Copy from another background
                          </label>
                        </div>
                        {!feature.copyFrom || !backgroundsList ? null : (
                          <select
                            name="copy-background"
                            data-background-feature-index={i}
                            defaultValue={
                              backgroundsList[feature.copyFrom.copyBackground]
                                ? backgroundsList[
                                    feature.copyFrom.copyBackground
                                  ].name
                                : "Choose background"
                            }
                            onChange={queueChange}
                          >
                            <option disabled hidden>
                              Choose background
                            </option>
                            {backgroundsList.map((background) => {
                              if (background.id === newBackground.id) {
                                return null;
                              }
                              return (
                                <option
                                  key={background.id}
                                  value={background.id}
                                >
                                  {background.name}
                                </option>
                              );
                            })}
                          </select>
                        )}
                        {!feature.copyFrom ||
                        !backgroundsList ||
                        !backgroundsList[
                          feature.copyFrom.copyBackground
                        ] ? null : (
                          <select
                            name="copy-feature"
                            data-background-feature-index={i}
                            defaultValue={
                              backgroundsList[feature.copyFrom.copyBackground]
                                .features[feature.copyFrom.copyFeature]
                                ? backgroundsList[
                                    feature.copyFrom.copyBackground
                                  ].features[feature.copyFrom.copyFeature].name
                                : "Choose feature"
                            }
                            onChange={queueChange}
                          >
                            <option disabled hidden>
                              Choose feature
                            </option>
                            {backgroundsList[
                              feature.copyFrom.copyBackground
                            ].features.map((featureOption) => {
                              if (featureOption.copyFrom) {
                                return null;
                              }
                              return (
                                <option
                                  key={featureOption.id}
                                  value={featureOption.id}
                                >
                                  {featureOption.name}
                                </option>
                              );
                            })}
                          </select>
                        )}
                      </div>
                      <button
                        name="background-feature"
                        data-background-feature-index={i}
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
              nodeId={`background-characteristics-copy`}
              label={
                <div className="col-flex">
                  <div className="row-flex">
                    <input
                      type="checkbox"
                      id={`background-characteristics-copy`}
                      name="background-characteristics-copy"
                      defaultChecked={
                        newBackground.characteristics.copyFrom ||
                        newBackground.characteristics.copyFrom === 0
                      }
                      onChange={queueChange}
                    ></input>
                    <label htmlFor="background-characteristics-copy">
                      Copy characteristics from another background
                    </label>
                  </div>
                  {backgroundsList &&
                  (newBackground.characteristics.copyFrom ||
                    newBackground.characteristics.copyFrom === 0) ? (
                    <select
                      name="copy-characteristics"
                      defaultValue={
                        backgroundsList[newBackground.characteristics.copyFrom]
                          ? backgroundsList[
                              newBackground.characteristics.copyFrom
                            ].name
                          : "Choose background"
                      }
                      onChange={queueChange}
                    >
                      <option disabled hidden>
                        Choose background
                      </option>
                      {backgroundsList.map((background) => {
                        if (background.id === newBackground.id) {
                          return null;
                        }
                        return (
                          <option key={background.id} value={background.id}>
                            {background.name}
                          </option>
                        );
                      })}
                    </select>
                  ) : null}
                </div>
              }
            ></CustomTreeItem>
            {newBackground.characteristics.copyFrom ||
            newBackground.characteristics.copyFrom === 0 ? null : (
              <>
                <CustomTreeItem
                  nodeId={`background-traits-list`}
                  label={<div>Personality Traits</div>}
                >
                  <CustomTreeItem
                    nodeId={`add-background-trait`}
                    label={
                      <button name="background-trait" onClick={addSection}>
                        Add Trait
                      </button>
                    }
                  ></CustomTreeItem>
                  {newBackground.characteristics.traits.map((trait, i) => (
                    <CustomTreeItem
                      key={`background-trait-${i}`}
                      nodeId={`background-trait-${i}`}
                      label={
                        <div className="row-flex">
                          <div className="col-12">
                            <DynamicTextArea
                              name="background-trait"
                              data-background-trait-index={i}
                              onChange={queueChange}
                              placeholder="Trait"
                              value={trait}
                              className="locked-textarea"
                            />
                          </div>
                          <button
                            name="background-trait"
                            data-background-trait-index={i}
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
                  nodeId={`background-ideals-list`}
                  label={<div>Ideals</div>}
                >
                  <CustomTreeItem
                    nodeId={`add-background-ideal`}
                    label={
                      <button name="background-ideal" onClick={addSection}>
                        Add Ideal
                      </button>
                    }
                  ></CustomTreeItem>
                  {newBackground.characteristics.ideals.map((ideal, i) => (
                    <CustomTreeItem
                      key={`background-ideal-${i}`}
                      nodeId={`background-ideal-${i}`}
                      label={
                        <div className="row-flex">
                          <div className="col-12">
                            <DynamicTextArea
                              name="background-ideal"
                              data-background-ideal-index={i}
                              onChange={queueChange}
                              placeholder="Ideal"
                              value={ideal}
                              className="locked-textarea"
                            />
                          </div>
                          <button
                            name="background-ideal"
                            data-background-ideal-index={i}
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
                  nodeId={`background-bonds-list`}
                  label={<div>Bonds</div>}
                >
                  <CustomTreeItem
                    nodeId={`add-background-bond`}
                    label={
                      <button name="background-bond" onClick={addSection}>
                        Add Bond
                      </button>
                    }
                  ></CustomTreeItem>
                  {newBackground.characteristics.bonds.map((bond, i) => (
                    <CustomTreeItem
                      key={`background-bond-${i}`}
                      nodeId={`background-bond-${i}`}
                      label={
                        <div className="row-flex">
                          <div className="col-12">
                            <DynamicTextArea
                              name="background-bond"
                              data-background-bond-index={i}
                              onChange={queueChange}
                              placeholder="Bond"
                              value={bond}
                              className="locked-textarea"
                            />
                          </div>
                          <button
                            name="background-bond"
                            data-background-bond-index={i}
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
                  nodeId={`background-flaws-list`}
                  label={<div>Flaws</div>}
                >
                  <CustomTreeItem
                    nodeId={`add-background-flaw`}
                    label={
                      <button name="background-flaw" onClick={addSection}>
                        Add Flaw
                      </button>
                    }
                  ></CustomTreeItem>
                  {newBackground.characteristics.flaws.map((flaw, i) => (
                    <CustomTreeItem
                      key={`background-flaw-${i}`}
                      nodeId={`background-flaw-${i}`}
                      label={
                        <div className="row-flex">
                          <div className="col-12">
                            <DynamicTextArea
                              name="background-flaw"
                              data-background-flaw-index={i}
                              onChange={queueChange}
                              placeholder="Flaw"
                              value={flaw}
                              className="locked-textarea"
                            />
                          </div>
                          <button
                            name="background-flaw"
                            data-background-flaw-index={i}
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
              </>
            )}
          </TreeView>
        </div>
        <div className="footer">
          <button
            onClick={() => {
              closeModal(newBackground.id);
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              updateItem(newBackground);
              closeModal(newBackground.id);
            }}
          >
            Save
          </button>
          <button
            name="delete-background"
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

export default EditBackgroundModal;
