import { Guest } from "../../types/guest";
import { CustomTable } from "../custom-table/custom-table";

const GuestsView: React.FC = () => {
  return (
    <>
      <CustomTable<Guest> data={[]} columns={[]} />
    </>
  );
};

export { GuestsView };
