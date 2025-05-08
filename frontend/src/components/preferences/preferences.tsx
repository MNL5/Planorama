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
} from "@mantine/core";
import { useMemo, useState } from "react";

import { preferences } from "../../utils/consts";
import { useFetchAllGuests } from "../../hooks/use-fetch-all-guests";

const Preferences: React.FC = () => {
  const { guestsData: guests, isLoading, isError } = useFetchAllGuests(true);
  const [selectedPreference, setSelectedPreference] = useState<string | null>(
    null
  );

  const guestOptionList = useMemo(
    () =>
      guests?.map((guest) => ({
        label: guest.name,
        value: guest.id,
      })) || [],
    [guests]
  );

  const preferenceOptionList = preferences.map((preference) => (
    <Combobox.Option value={preference.label} key={preference.key}>
      <Flex align={"center"} gap={10}>
        {preference.icon()}
        <Text>{preference.label}</Text>
      </Flex>
    </Combobox.Option>
  ));

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  return (
    <Stack w={"100%"} h={"100vh"} p={100}>
      <Flex w={"100%"} align={"center"} gap={100} justify={"center"}>
        <Autocomplete
          w={400}
          label={"Guest Name"}
          placeholder={"Select a guest"}
          data={guestOptionList}
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
          placeholder={"Select a guest"}
          data={guestOptionList}
          error={isError ? "Error fetching guests" : undefined}
          rightSection={isLoading ? <Loader size={"xs"} /> : null}
        />
      </Flex>
      <Stack></Stack>
    </Stack>
  );
};

export { Preferences };
