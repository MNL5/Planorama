import {
  IconHeart,
  IconMoodAngry,
  IconMoodAnnoyed,
  IconMoodHappy,
} from "@tabler/icons-react";
import { Relation } from "../types/relation";

const preferenceOptions: {
  label: string;
  value: Relation;
  icon: () => React.ReactElement;
}[] = [
  { label: "Must sit with", value: Relation.MUST, icon: () => <IconHeart /> },
  {
    label: "Like to sit with",
    value: Relation.LIKE,
    icon: () => <IconMoodHappy />,
  },
  {
    label: "Hate to sit with",
    value: Relation.HATE,
    icon: () => <IconMoodAnnoyed />,
  },
  {
    label: "Must not sit with",
    value: Relation.MUST_NOT,
    icon: () => <IconMoodAngry />,
  },
];

export { preferenceOptions };
