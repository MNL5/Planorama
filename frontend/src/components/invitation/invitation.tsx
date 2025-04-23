import React from 'react';
import style from './invitation.module.css';
import rsvp from "../../assets/rsvp.svg";
import { EventType } from '../../types/event';

const Invitation: React.FC<{event: EventType}> = ({event}) => {
    return (
        <div className={style.container}>
            <h1 className={style.title}>Save The Date</h1>
            <span className={style.date}>{new Date(event.time).toLocaleString()}</span>
            <img
                className={style.img}
                src={event.invitationImg}
                alt="Event"
            />
            <h2 className={style.name}>{event?.name}</h2>
            <p className={style.text}>
                {event.invitationText}
            </p>
            <div className={style.rsvpContainer}>
                <img
                    src={rsvp}
                    alt="RSVP"
                    style={{ width: '150px', height: '50px'}}
                />
                <div>
                    Approve RSVP
                </div>
            </div>
        </div>
    );
};

export default Invitation;