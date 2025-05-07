import {
  IconHeart,
  IconMoodAngry,
  IconMoodAnnoyed,
  IconMoodHappy,
} from "@tabler/icons-react";

const multipleEventPages = ["/", "/event-list"];
const preferences = [
  { key: "MUST", label: "Must sit with", icon: () => <IconHeart /> },
  { key: "LIKE", label: "Like to sit with", icon: () => <IconMoodHappy /> },
  { key: "HATE", label: "Hate to sit with", icon: () => <IconMoodAnnoyed /> },
  {
    key: "MUST_NOT",
    label: "Must not sit with",
    icon: () => <IconMoodAngry />,
  },
];

export { multipleEventPages, preferences };
