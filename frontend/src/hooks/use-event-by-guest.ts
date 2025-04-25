import { CanceledError } from 'axios';
import { useEffect, useState } from 'react';

import { getEventByGuestId } from "../services/event-service/event-service";
import { EventType } from '../types/event';

const useEventByGuest = (guestId?: string) => {
    const [event, setEvent] = useState<EventType | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!guestId) return;

        const { request, abort } = getEventByGuestId(guestId);
            request
                .then((response) => {
                    setEvent(response.data);
                    setIsLoading(false);
                })
                .catch((error) => {
                    if (!(error instanceof CanceledError)) {
                        console.log('Failed to refresh token');
                        setIsLoading(false);
                    }
                });

            return abort;
    }, [guestId]);

    return { isLoading, event };
};

export default useEventByGuest;
