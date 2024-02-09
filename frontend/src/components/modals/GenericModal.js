// Generic modal, displays itself/children if opened, closes when user clicks outside

import "../../styling//components/modals/GenericModal.css";
import { useEffect } from "react";

const GenericModal = ({ isOpen = false, closeModal, header, body, footer }) => {
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
      className="modal-background"
      onClick={(event) => {
        if (!event.target.closest(".modal-container")) {
          closeModal();
        }
      }}
    >
      <div className="modal-container">
        <div className="header">{header}</div>
        <div className="body">{body}</div>
        <div className="footer">{footer}</div>
      </div>
    </div>
  ) : null;
};

export default GenericModal;
