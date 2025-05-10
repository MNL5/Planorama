import { GuestsView } from "../components/guests-view/guests-view";
import { Preferences } from "../components/preferences/preferences";
import { CreateEvent } from "../components/create-event/create-event";
import TableArrangement from "../components/table-arragment/table-arragement";

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
];
