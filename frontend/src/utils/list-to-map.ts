import { OptionType } from "../types/option-type";

const listToMap = (list: OptionType[]) => {
  const result: { [key: string]: string } = {};
  list.forEach((item) => (result[item.value] = item.label));
  return result;
};

export { listToMap };
