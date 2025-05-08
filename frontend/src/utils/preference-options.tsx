import {
  IconHeart,
  IconMoodAngry,
  IconMoodAnnoyed,
  IconMoodHappy,
} from "@tabler/icons-react";

const preferenceOptions = [
  { label: "Must sit with", value: "MUST", icon: () => <IconHeart /> },
  { label: "Like to sit with", value: "LIKE", icon: () => <IconMoodHappy /> },
  { label: "Hate to sit with", value: "HATE", icon: () => <IconMoodAnnoyed /> },
  {
    label: "Must not sit with",
    value: "MUST_NOT",
    icon: () => <IconMoodAngry />,
  },
];

export { preferenceOptions };
