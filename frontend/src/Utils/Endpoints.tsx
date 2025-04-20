import Overview from '../Pages/Overview/Overview';
import TableArrangement from '../Pages/TableArragment/TableArragement';

export const ENDPOINTS = [
    {
        name: 'Event Details',
        path: '/event-details',
        element: <Overview />,
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
        name: 'Tasks',
        path: '/tasks',
        element: <Overview />,
    },
    {
        name: 'Venue Seats',
        path: '/venue-seats',
        element: <TableArrangement />,
    },
    {
        name: 'Seating',
        path: '/seating',
        element: <Overview />,
    },
    {
        name: 'To Do',
        path: '/notes',
        element: <Overview />,
    },
];
