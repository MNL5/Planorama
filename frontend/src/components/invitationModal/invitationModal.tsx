import React from 'react';
import style from './invitationModal.module.css';

import Invitation from '../invitation/invitation';
import { EventType } from '../../types/event';
import { createPortal } from 'react-dom';

const InvitationModal: React.FC<{event: EventType, onClose: () => void}> = ({event, onClose}) => {
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
    document.getElementById("root")!
  );
};

export default InvitationModal;