import { RsvpStatus } from "../types/rsvp-status";

export default [
  {
    label: "Accepted",
    value: RsvpStatus.ACCEPTED,
  },
  {
    label: "Tentative",
    value: RsvpStatus.TENTATIVE,
  },
  {
    label: "Decline",
    value: RsvpStatus.DECLINE,
  },
];
