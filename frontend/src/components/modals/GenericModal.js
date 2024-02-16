// Generic modal, displays itself/children if opened, closes when user clicks outside

import "../../styling//components/modals/GenericModal.css";
import { useEffect } from "react";

const GenericModal = ({
  isOpen = false,
  closeModal,
  header,
  body,
  footer,
  extraStyling,
}) => {
  // Prevent scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  return isOpen ? (
    <div
      className={`modal-background ${extraStyling.modal_background}`}
      onClick={(event) => {
        if (!event.target.closest(".modal-container")) {
          closeModal();
        }
      }}
    >
      <div className={`modal-container ${extraStyling.modal_container}`}>
        <div className={`header ${extraStyling.header}`}>{header}</div>
        <div className={`body ${extraStyling.body}`}>{body}</div>
        <div className={`footer ${extraStyling.footer}`}>{footer}</div>
      </div>
    </div>
  ) : null;
};

export default GenericModal;
