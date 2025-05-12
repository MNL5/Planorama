import { GuestsView } from "../components/guests-view/guests-view";
import { Preferences } from "../components/preferences/preferences";
import { CreateEvent } from "../components/create-event/create-event";
import TableArrangement from "../components/table-arragment/table-arragement";
import InvitationPage from "../components/invitationPage/invitationPage";
import GiftPage from "../components/giftPage/giftPage";
import { GiftsList } from "../components/gifts-list/gifts-list";

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
    name: "Preferences",
    path: "/preferences",
    element: <Preferences />,
  },
  {
    name: "Venue Seats",
    path: "/venue-seats",
    element: <TableArrangement />,
  },
  {
        name: 'Gifts',
        path: '/gifts',
        element: <GiftsList />,
    },
];

export const GUEST_ENDPOINTS = [
    {
        path: "/rsvp",
        element: <InvitationPage />,
    },
    {
        path: "/gift",
        element: <GiftPage />,
    }
]