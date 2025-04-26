import { CreateEvent } from '../components/create-event/create-event';
import Overview from '../components/overview/overview';
import TableArrangement from '../Pages/TableArragment/TableArragement';


export const ENDPOINTS = [
    {
        name: "Event Details",
        path: "/event-details",
        element: <CreateEvent />,
    },
    {
        name: 'Guests',
        path: '/guests',
        element: <Overview />,
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
];
