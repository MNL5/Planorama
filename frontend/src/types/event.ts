import Element from "./Element";

interface CreateEvent {
  name: string;
  invitationText: string;
  invitationImg: string;
  time: Date;
}

type Event = CreateEvent & {
  id: string;
  diagram: { elements: Element[] };
};

export type { CreateEvent, Event };
