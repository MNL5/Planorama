import GlutenImage from "../assets/gluten.svg";
import VeganImage from "../assets/vegan.svg";
import VegetarianImage from "../assets/vegetarian.svg";
import KidImage from "../assets/kid.svg";
import KosherImage from "../assets/kosher.svg";
import { MealType } from "../types/meal";

export default [
  {
    label: "Vegetarian",
    value: MealType.VEGETARIAN,
    image: VegetarianImage,
  },
  {
    label: "Vegan",
    value: MealType.VEGAN,
    image: VeganImage,
  },
  {
    label: "Gluten Free",
    value: MealType.GLUTEN_FREE,
    image: GlutenImage,
  },
  {
    label: "Kosher",
    value: MealType.KOSHER,
    image: KosherImage,
  },
  {
    label: "Kid Friendly",
    value: MealType.KID,
    image: KidImage,
  },
];
