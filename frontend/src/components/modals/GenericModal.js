// Generic modal, displays itself/children if opened, closes when user clicks outside

import "../../styling//components/modals/GenericModal.css";
import { useEffect } from "react";

const GenericModal = ({
  isOpen = false,
  closeModal,
  header,
  body,
  footer,
  category,
  closeOnOutsideClick = true,
}) => {
  // Prevent scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className={`modal-background ${category}-modal-background`}
      onClick={(event) => {
        if (closeOnOutsideClick && !event.target.closest(".modal-container")) {
          closeModal();
        }
      }}
    >
      <div className={`modal-container ${category}-modal-container`}>
        <div className={`header ${category}-header`}>{header}</div>
        <div className={`body ${category}-body`}>{body}</div>
        <div className={`footer ${category}-footer`}>{footer}</div>
      </div>
    </div>
  );
};

export default GenericModal;
