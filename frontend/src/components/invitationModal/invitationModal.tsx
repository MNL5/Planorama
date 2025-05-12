import React from "react";
import { createPortal } from "react-dom";

import style from "./invitationModal.module.css";
import Invitation from "../invitation/invitation";
import { Event } from "../../types/event";

const InvitationModal: React.FC<{ event: Event; onClose: () => void }> = ({
  event,
  onClose,
}) => {
  const onModalClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return createPortal(
    <div className={style.backdrop} onClick={onClose}>
      <div className={style.modal} onClick={onModalClick}>
        <span className={style.x} onClick={onClose}>
          ×
        </span>
        <Invitation event={event} />
      </div>
    </div>,
    document.getElementById("root")!,
  );
};

export default InvitationModal;
