import { useMemo, useState } from "react";
import {
  Autocomplete,
  Combobox,
  Flex,
  Input,
  InputBase,
  Loader,
  Stack,
  Text,
  useCombobox,
} from "@mantine/core";

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
    <Stack w={"100%"} h={"100vh"} p={20}>
      <Flex w={"100%"} align={"center"} gap={100} justify={"center"}>
        <Autocomplete
          w={400}
          label={"Guest Name"}
          placeholder={"Select a guest"}
          data={guestOptionList}
          error={isError ? "Error fetching guests" : undefined}
          rightSection={isLoading ? <Loader size={"xs"} /> : null}
        />
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
