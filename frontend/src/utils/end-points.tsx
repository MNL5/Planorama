import Overview from '../components/overview/overview';
import TableArrangement from '../components/table-arragment/table-arragement';
import { GuestsView } from '../components/guests-view/guests-view';
import { CreateEvent } from '../components/create-event/create-event';
import GuestSeating from '../components/guest-seating/guest-seating';

export const ENDPOINTS = [
    {
        name: 'Event Details',
        path: '/event-details',
        element: <CreateEvent />,
    },
    {
        name: 'Guests',
        path: '/guests',
        element: <GuestsView />,
    },
    {
        name: 'Preferences',
        path: '/preferences',
        element: <Overview />,
    },
    {
        name: 'Guest Seating',
        path: '/guest-seating',
        element: <GuestSeating />,
    },
    {
        name: 'Venue Seats',
        path: '/venue-seats',
        element: <TableArrangement />,
    },
    {
        name: 'To Do',
        path: '/notes',
        element: <Overview />,
    },
];
