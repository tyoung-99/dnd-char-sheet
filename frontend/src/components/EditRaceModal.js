// Popup for editing 1 race
import "../styling/EditDataModal.css";
import { useState } from "react";

const EditRaceModal = ({ race, closeModal, updateRace }) => {
  const [newRace, setNewRace] = useState(race);

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
    console.log(JSON.parse(JSON.stringify(raceChange)));
  };

  return (
    <div className="modal-background">
      <div className="modal-container">
        <div className="header">
          <input
            name="race-name"
            onChange={queueChange}
            placeholder="Race Name"
            defaultValue={race.name}
          ></input>
        </div>
        <div className="body grid-container row-flex">
          {race.sources.map((src, i) => (
            <div key={i} className="col-12 col-flex grid-tile">
              <input
                name="race-src-name"
                data-race-src-index={i}
                onChange={queueChange}
                className="subtitle-1 centered"
                placeholder="Source Name"
                defaultValue={src.name}
              ></input>
              <h1 className="subtitle-1">Traits</h1>
              <div className="row-flex wrap">
                {src.traits.map((trait, j) => (
                  <div key={j} className="grid-tile borderless">
                    <input
                      name="race-trait-name"
                      data-race-src-index={i}
                      data-race-trait-index={j}
                      onChange={queueChange}
                      className="subtitle-2"
                      placeholder="Trait Name"
                      defaultValue={trait.name}
                    ></input>
                    <textarea
                      name="race-trait-desc"
                      data-race-src-index={i}
                      data-race-trait-index={j}
                      onChange={queueChange}
                      placeholder="Trait Description"
                      defaultValue={trait.description}
                      rows={5}
                    />
                  </div>
                ))}
              </div>
              <h1 className="subtitle-1">Subraces</h1>
              {src.subraces.map((subrace, j) => (
                <div key={j} className="grid-tile">
                  <input
                    name="subrace-name"
                    data-race-src-index={i}
                    data-subrace-index={j}
                    onChange={queueChange}
                    className="subtitle-1 centered"
                    placeholder="Subrace Name"
                    defaultValue={subrace.name}
                  ></input>
                  {subrace.sources.map((subSrc, k) => (
                    <div key={k} className="grid-tile">
                      <input
                        name="subrace-src-name"
                        data-race-src-index={i}
                        data-subrace-index={j}
                        data-subrace-src-index={k}
                        onChange={queueChange}
                        className="subtitle-2 centered"
                        placeholder="Source Name"
                        defaultValue={subSrc.name}
                      ></input>
                      <h2 className="subtitle-2">Traits</h2>
                      <div className="row-flex">
                        {subSrc.traits.map((subTrait, l) => (
                          <div key={l}>
                            <input
                              name="subrace-trait-name"
                              data-race-src-index={i}
                              data-subrace-index={j}
                              data-subrace-src-index={k}
                              data-subrace-trait-index={l}
                              onChange={queueChange}
                              className="subtitle-3"
                              placeholder="Trait Name"
                              defaultValue={subTrait.name}
                            ></input>
                            <textarea
                              name="subrace-trait-desc"
                              data-race-src-index={i}
                              data-subrace-index={j}
                              data-subrace-src-index={k}
                              data-subrace-trait-index={l}
                              onChange={queueChange}
                              placeholder="Trait Description"
                              defaultValue={subTrait.description}
                              rows={5}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="footer">
          <button
            onClick={() => {
              closeModal(race.name);
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              updateRace(newRace);
              closeModal(race.name);
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditRaceModal;
