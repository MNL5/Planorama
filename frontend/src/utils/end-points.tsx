import Overview from '../components/overview/overview';
import TableArrangement from '../components/table-arragment/table-arragement';
import { GuestsView } from '../components/guests-view/guests-view';
import { CreateEvent } from '../components/create-event/create-event';
import { GiftsList } from '../components/gifts-list/gifts-list';

export const ENDPOINTS = [
    {
        name: "Event Details",
        path: "/event-details",
        element: <CreateEvent />,
    },
    {
        name: "Guests",
        path: "/guests",
        element: <GuestsView />,
    },
    {
        name: 'Preferences',
        path: '/preferences',
        element: <Overview />,
    },
    {
        name: "Venue Seats",
        path: "/venue-seats",
        element: <TableArrangement />,
    },
    {
        name: 'To Do',
        path: '/notes',
        element: <Overview />,
    },
    {
        name: 'Gifts',
        path: '/gifts',
        element: <GiftsList />,
    },
];
