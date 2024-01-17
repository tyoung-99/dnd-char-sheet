// Allows viewing/editing background data on races, classes, etc.
import "../styling/AdminPage.css";
import AdminEditComp from "../components/AdminEditComp";
import EditAlignmentModal from "../components/modals/EditAlignmentModal";
import EditRaceModal from "../components/modals/EditRaceModal";
import EditBackgroundModal from "../components/modals/EditBackgroundModal";
import EditAbilityModal from "../components/modals/EditAbilityModal";
import EditSkillModal from "../components/modals/EditSkillModal";
import EditLanguageModal from "../components/modals/EditLanguageModal";

const AdminPage = () => {
  const abilityTemplate = { name: "New Ability", abbreviation: "" };

  const skillTemplate = { name: "New Skill", ability: -1 };

  const toolTemplate = {};

  const languageTemplate = {
    name: "New Language",
    typicalSpeakers: "",
    script: "",
    prevalence: "",
  };

  const alignmentTemplate = { name: "New Alignment" };

  const raceTemplate = {
    name: "New Race",
    sources: [
      {
        name: "New Source",
        traits: [],
        subraces: [],
      },
    ],
  };

  const backgroundTemplate = {
    name: "New Background",
    source: "",
    features: [
      {
        name: "",
        description: "",
        copyFrom: null,
        id: 0,
      },
    ],
    characteristics: {
      copyFrom: null,
      traits: [""],
      ideals: [""],
      bonds: [""],
      flaws: [""],
    },
    skills: [-1, -1],
    tools: [-1],
    languages: [-1],
    equipment: [{ id: -1, count: 0 }],
  };

  return (
    <div className="admin">
      <div className="admin-col">
        <h1>Abilities</h1>
        <AdminEditComp
          singular={"Ability"}
          plural={"Abilities"}
          template={abilityTemplate}
          EditModal={EditAbilityModal}
        />
      </div>
      <div className="admin-col">
        <h1>Skills</h1>
        <AdminEditComp
          singular={"Skill"}
          plural={"Skills"}
          template={skillTemplate}
          EditModal={EditSkillModal}
        />
      </div>
      <div className="admin-col">
        <h1>Tools</h1>
        <AdminEditComp
          singular={"Tool"}
          plural={"Tools"}
          template={toolTemplate}
          // EditModal={EditToolModal}
        />
      </div>
      <div className="admin-col">
        <h1>Languages</h1>
        <AdminEditComp
          singular={"Language"}
          plural={"Languages"}
          template={languageTemplate}
          EditModal={EditLanguageModal}
        />
      </div>
      <div className="admin-col">
        <h1>Alignments</h1>
        <AdminEditComp
          singular={"Alignment"}
          plural={"Alignments"}
          template={alignmentTemplate}
          EditModal={EditAlignmentModal}
        />
      </div>
      <div className="admin-col">
        <h1>Races</h1>
        <AdminEditComp
          singular={"Race"}
          plural={"Races"}
          template={raceTemplate}
          EditModal={EditRaceModal}
        />
      </div>
      <div className="admin-col">
        <h1>Backgrounds</h1>
        <AdminEditComp
          singular={"Background"}
          plural={"Backgrounds"}
          template={backgroundTemplate}
          EditModal={EditBackgroundModal}
        />
      </div>
    </div>
  );
};

export default AdminPage;
