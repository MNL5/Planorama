import GiftPage from "../components/giftPage/giftPage";
import { Schedule } from "../components/schedule/schedule";
import { GiftsList } from "../components/gifts-list/gifts-list";
import { GuestsView } from "../components/guests-view/guests-view";
import { Preferences } from "../components/preferences/preferences";
import GuestSeating from "../components/guest-seating/guest-seating";
import { CreateEvent } from "../components/create-event/create-event";
import TableArrangement from "../components/table-arragment/table-arragement";
import InvitationPage from "../components/invitationPage/invitationPage";
import ToDoList from "../components/ToDoList/ToDoList";

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
    name: "Guest Seating",
    path: "/guest-seating",
    element: <GuestSeating />,
  },
  {
    name: "Gifts",
    path: "/gifts",
    element: <GiftsList />,
  },
  {
    name: "Schedule",
    path: "/schedule",
    element: <Schedule />,
  },
  {
    name: "To Do",
    path: "/todo",
    element: <ToDoList />,
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
  },
];
