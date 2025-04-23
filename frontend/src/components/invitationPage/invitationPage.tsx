import React from 'react';
import style from './invitationPage.module.css';
import { useParams } from 'react-router-dom';
import useEventBGuest from '../../hooks/use-event-by-guest';
import { CircularProgress } from '@mui/material';
import Invitation from '../invitation/invitation';

const InvitationPage: React.FC = () => {
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

    return <Invitation event={event} />;
};

export default InvitationPage;