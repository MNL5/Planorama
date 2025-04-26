import GlutenImage from "../assets/gluten.svg";
import VeganImage from "../assets/vegan.svg";
import VegetarianImage from "../assets/vegetarian.svg";
import KidImage from "../assets/kid.svg";
import KosherImage from "../assets/kosher.svg";
import { MealType } from "../types/meal";

export default [
  {
    name: "Vegetarian",
    value: MealType.VEGETARIAN,
    image: VegetarianImage,
  },
  {
    name: "Vegan",
    value: MealType.VEGAN,
    image: VeganImage,
  },
  {
    name: "Gluten Free",
    value: MealType.GLUTEN_FREE,
    image: GlutenImage,
  },
  {
    name: "Kosher",
    value: MealType.KOSHER,
    image: KosherImage,
  },
  {
    name: "Kid Friendly",
    value: MealType.KID,
    image: KidImage,
  },
];
