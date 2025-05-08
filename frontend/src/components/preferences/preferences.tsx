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
  Group,
  Button,
} from "@mantine/core";
import { toast } from "react-toastify";
import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { Relation } from "../../types/relation";
import { CustomTable } from "../custom-table/custom-table";
import { GuestRelation } from "../../types/seating-preference";
import { useEventContext } from "../../contexts/event-context";
import { preferenceOptions } from "../../utils/preference-options";
import { useFetchAllGuests } from "../../hooks/use-fetch-all-guests";
import { seatingPreferenceColumns } from "../../utils/seating-preference-columns";
import {
  createRelation,
  deleteRelation,
  updateRelation,
} from "../../services/relation-service/relation-service";

const Preferences: React.FC = () => {
  const { currentEvent } = useEventContext();
  const { guestsData: guests, isLoading, isError } = useFetchAllGuests(true);
  const [selectedPreference, setSelectedPreference] = useState<Relation | null>(
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
        .filter((option) => option.value !== secondSelectedGuest) || [],
    [guests, secondSelectedGuest]
  );

  const secondGuestOptionList = useMemo(
    () =>
      guestOptionList?.filter((option) => option.value !== selectedGuest) || [],
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

  const onCancel = () => {
    setSelectedGuest(undefined);
    setSecondSelectedGuest(undefined);
    setSelectedPreference(null);
  };

  const onAdd = () => {
    if (selectedGuest && secondSelectedGuest && selectedPreference) {
      mutateCreateRelation({
        firstGuestId: selectedGuest,
        relation: selectedPreference,
        secondGuestId: secondSelectedGuest,
      });
    }
  };

  const handleGuestChange = (guestName: string) => {
    const selectedGuest = guestOptionList.find(
      (guest) => guest.label === guestName
    );
    if (selectedGuest) {
      setSelectedGuest(selectedGuest.value);
    }
  };

  const handleSecondGuestChange = (guestName: string) => {
    const selectedGuest = secondGuestOptionList.find(
      (guest) => guest.label === guestName
    );
    if (selectedGuest) {
      setSecondSelectedGuest(selectedGuest.value);
    }
  };

  const { mutateAsync: mutateCreateRelation } = useMutation<
    GuestRelation,
    Error,
    Omit<GuestRelation, "id">
  >({
    mutationFn: (newRelation) =>
      createRelation(currentEvent?.id as string, newRelation),
    onSuccess: () => {
      toast.success("Preference added successfully");
    },
    onError: () => {
      toast.error("Failed to add Preference");
    },
  });

  const { mutateAsync: mutateUpdateGuest } = useMutation<
    GuestRelation,
    Error,
    GuestRelation
  >({
    mutationFn: (updatedRelation) =>
      updateRelation(
        currentEvent?.id as string,
        updatedRelation,
        updatedRelation.id
      ),
    onSuccess: () => {
      toast.success("Guest updated successfully");
    },
    onError: () => {
      toast.error("Failed to update guest");
    },
  });

  const { mutateAsync: mutateDeleteGuest } = useMutation<
    GuestRelation,
    Error,
    string
  >({
    mutationFn: (guestId) => deleteRelation(guestId),
    onSuccess: () => {
      toast.success("Guest deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete guest");
    },
  });

  return (
    <Stack w={"100%"} h={"100vh"} p={100} align={"center"} gap={40}>
      <Stack align={"flex-end"} gap={20}>
        <Flex align={"center"} gap={100} justify={"center"}>
          <Autocomplete
            w={400}
            label={"Guest Name"}
            value={selectedGuest}
            data={guestOptionList}
            onChange={handleGuestChange}
            placeholder={"Select a guest"}
            error={isError ? "Error fetching guests" : undefined}
            rightSection={isLoading ? <Loader size={"xs"} /> : null}
          />
          <Stack align={"flex-start"} gap={2}>
            <InputLabel>Preference</InputLabel>
            <Combobox
              store={combobox}
              onOptionSubmit={(preference) => {
                console.log(preference);
                setSelectedPreference(preference as Relation);
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
            onChange={handleSecondGuestChange}
            error={isError ? "Error fetching guests" : undefined}
            rightSection={isLoading ? <Loader size={"xs"} /> : null}
          />
        </Flex>
        <Group mt={"md"}>
          <Button onClick={onCancel} variant={"outline"}>
            Cancel
          </Button>
          <Button onClick={onAdd}>Add</Button>
        </Group>
      </Stack>
      <Stack>
        <Title order={1} c={"primary"}>
          Your Seating Preferences
        </Title>
        <CustomTable<GuestRelation>
          data={seatingPreferenceData}
          columns={seatingPreferenceColumns(
            guestOptionList,
            secondGuestOptionList
          )}
          updateRow={mutateUpdateGuest}
          deleteRow={mutateDeleteGuest}
        />
      </Stack>
    </Stack>
  );
};

export { Preferences };
