import React from 'react';
import style from './invitation.module.css';
import { useParams } from 'react-router-dom';
import useEventBGuest from '../../hooks/use-event-by-guest';
import { CircularProgress } from '@mui/material';
import rsvp from "../../assets/rsvp.svg";

const Invitation: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const {event, isLoading} = useEventBGuest(id);

    if (!event) {
        if (isLoading) {
            return (
                  <CircularProgress
                    color="secondary"
                    style={{ position: "absolute", top: "40%", left: "50%" }}
                  />
                );
        }
        return <div className={style.container}>
                <h1>Event not found</h1>
                <p>Please check the link or contact the event organizer.</p>
            </div> 
    }

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