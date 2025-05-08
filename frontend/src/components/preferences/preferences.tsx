import {
  Text,
  Flex,
  Input,
  Stack,
  Loader,
  InputBase,
  InputLabel,
  Combobox,
  useCombobox,
  Autocomplete,
  Title,
} from "@mantine/core";
import { useMemo, useState } from "react";

import { CustomTable } from "../custom-table/custom-table";
import { SeatingPreference } from "../../types/seating-preference";
import { preferenceOptions } from "../../utils/preference-options";
import { useFetchAllGuests } from "../../hooks/use-fetch-all-guests";

const Preferences: React.FC = () => {
  const { guestsData: guests, isLoading, isError } = useFetchAllGuests(true);
  const [selectedPreference, setSelectedPreference] = useState<string | null>(
    null
  );
  const [selectedGuest, setSelectedGuest] = useState<string | undefined>();
  const [secondSelectedGuest, setSecondSelectedGuest] = useState<
    string | undefined
  >();

  const guestOptionList = useMemo(
    () =>
      guests
        ?.map((guest) => ({
          label: guest.name,
          value: guest.id,
        }))
        .filter((option) => option.label !== secondSelectedGuest) || [],
    [guests, secondSelectedGuest]
  );

  const secondGuestOptionList = useMemo(
    () =>
      guestOptionList?.filter((option) => option.label !== selectedGuest) || [],
    [guestOptionList, selectedGuest]
  );

  const seatingPreferenceData = useMemo(() => [], []);

  const preferenceOptionList = preferenceOptions.map((preference) => (
    <Combobox.Option value={preference.label} key={preference.value}>
      <Flex align={"center"} gap={10}>
        {preference.icon()}
        <Text>{preference.label}</Text>
      </Flex>
    </Combobox.Option>
  ));

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const createSeatingPreference = async () => {
    return {} as SeatingPreference;
  };

  const updateSeatingPreference = async () => {
    return {} as SeatingPreference;
  };

  const deleteSeatingPreference = async () => {
    return {} as SeatingPreference;
  };

  return (
    <Stack w={"100%"} h={"100vh"} p={100}>
      <Flex w={"100%"} align={"center"} gap={100} justify={"center"}>
        <Autocomplete
          w={400}
          label={"Guest Name"}
          value={selectedGuest}
          data={guestOptionList}
          onChange={setSelectedGuest}
          placeholder={"Select a guest"}
          error={isError ? "Error fetching guests" : undefined}
          rightSection={isLoading ? <Loader size={"xs"} /> : null}
        />
        <Stack align={"flex-start"} gap={2}>
          <InputLabel>Preference</InputLabel>
          <Combobox
            store={combobox}
            onOptionSubmit={(preference) => {
              setSelectedPreference(preference);
              combobox.closeDropdown();
            }}
          >
            <Combobox.Target>
              <InputBase
                w={400}
                component={"button"}
                type={"button"}
                pointer
                rightSection={<Combobox.Chevron />}
                rightSectionPointerEvents={"none"}
                onClick={() => combobox.toggleDropdown()}
              >
                {selectedPreference || (
                  <Input.Placeholder>Select preference</Input.Placeholder>
                )}
              </InputBase>
            </Combobox.Target>

            <Combobox.Dropdown w={400}>
              <Combobox.Options>{preferenceOptionList}</Combobox.Options>
            </Combobox.Dropdown>
          </Combobox>
        </Stack>
        <Autocomplete
          w={400}
          label={"Guest Name"}
          value={secondSelectedGuest}
          data={secondGuestOptionList}
          placeholder={"Select a guest"}
          onChange={setSecondSelectedGuest}
          error={isError ? "Error fetching guests" : undefined}
          rightSection={isLoading ? <Loader size={"xs"} /> : null}
        />
      </Flex>
      <Stack>
        <Title order={1} c={"primary"}>
          Your Seating Preferences
        </Title>
        <CustomTable<SeatingPreference>
          data={seatingPreferenceData}
          columns={[]}
          createRow={createSeatingPreference}
          updateRow={updateSeatingPreference}
          deleteRow={deleteSeatingPreference}
        />
      </Stack>
    </Stack>
  );
};

export { Preferences };
