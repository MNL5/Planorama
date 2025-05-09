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
  Tooltip,
} from "@mantine/core";
import { clone, isNil } from "lodash";
import { toast } from "react-toastify";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Relation } from "../../types/relation";
import { CustomTable } from "../custom-table/custom-table";
import { GuestRelation } from "../../types/seating-preference";
import { useEventContext } from "../../contexts/event-context";
import { preferenceOptions } from "../../utils/preference-options";
import { useFetchAllGuests } from "../../hooks/use-fetch-all-guests";
import { relationColumns } from "../../utils/relation-columns";
import {
  createRelation,
  deleteRelation,
  getAllRelations,
  updateRelation,
} from "../../services/relation-service/relation-service";
import { Guest } from "../../types/guest";
import { OptionType } from "../../types/option-type";

const Preferences: React.FC = () => {
  const { currentEvent } = useEventContext();
  const { guestsData: guests, isLoading, isError } = useFetchAllGuests(true);
  const [selectedPreference, setSelectedPreference] = useState<string>();
  const [selectedRelation, setSelectedRelation] = useState<Relation>();
  const [selectedGuest, setSelectedGuest] = useState<string | undefined>();
  const [secondSelectedGuest, setSecondSelectedGuest] = useState<
    string | undefined
  >();

  const mapGuestsToOptionList = (guests: Guest[] | undefined): OptionType[] => {
    return guests
      ? guests.map((guest) => ({
          label: guest.name,
          value: guest.id,
        }))
      : [];
  };

  const selectedGuestId = useMemo(() => {
    const selectedOption = mapGuestsToOptionList(guests)?.find(
      (guest) => guest.label === selectedGuest
    );

    return selectedOption?.value ?? "";
  }, [guests, selectedGuest]);

  const secondSelectedGuestId = useMemo(() => {
    const selectedOption = mapGuestsToOptionList(guests)?.find(
      (guest) => guest.label === secondSelectedGuest
    );

    return selectedOption?.value ?? "";
  }, [guests, secondSelectedGuest]);

  const guestOptionList: OptionType[] = useMemo(
    () =>
      mapGuestsToOptionList(guests)?.filter(
        (option) => option.value !== secondSelectedGuestId
      ) || [],
    [guests, secondSelectedGuestId]
  );

  const secondGuestOptionList = useMemo(
    () =>
      guestOptionList?.filter((option) => option.value !== selectedGuestId) ||
      [],
    [guestOptionList, selectedGuestId]
  );

  const columns = useMemo(
    () => relationColumns(clone(guestOptionList), clone(secondGuestOptionList)),
    [guestOptionList, secondGuestOptionList]
  );

  const {
    data: relationsData,
    isSuccess: isRelationsSuccess,
    isLoading: isRelationsLoading,
    isError: isRelationsError,
    isFetching: isRelationsFetching,
    refetch: refetchRelations,
  } = useQuery<GuestRelation[], Error>({
    queryKey: ["fetchRelations", currentEvent?.id],
    queryFn: () => getAllRelations(currentEvent?.id as string),
    enabled: !!currentEvent?.id,
  });

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

  const reset = () => {
    setSelectedGuest("");
    setSecondSelectedGuest("");
    setSelectedPreference(undefined);
  };

  const isEmptyField = useMemo(() => {
    return !selectedGuestId || !secondSelectedGuestId || !selectedPreference;
  }, [secondSelectedGuestId, selectedGuestId, selectedPreference]);

  const onAdd = () => {
    if (selectedGuestId && secondSelectedGuestId && selectedRelation) {
      mutateCreateRelation({
        firstGuestId: selectedGuestId,
        relation: selectedRelation,
        secondGuestId: secondSelectedGuestId,
      });
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
      reset();
      toast.success("Preference added successfully");
      refetchRelations();
    },
    onError: () => {
      toast.error("Failed to add preference");
    },
  });

  const { mutateAsync: mutateUpdateRelation } = useMutation<
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
      toast.success("Preference updated successfully");
      refetchRelations();
    },
    onError: () => {
      toast.error("Failed to update preference");
    },
  });

  const { mutateAsync: mutateDeleteRelation } = useMutation<
    GuestRelation,
    Error,
    string
  >({
    mutationFn: (guestId) => deleteRelation(guestId),
    onSuccess: () => {
      toast.success("Preference deleted successfully");
      refetchRelations();
    },
    onError: () => {
      toast.error("Failed to delete preference");
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
                const selectedOption = preferenceOptions.find(
                  (option) => option.label === preference
                );
                setSelectedRelation(selectedOption?.value);
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
        <Group mt={"md"}>
          <Button onClick={reset} variant={"outline"}>
            Clear
          </Button>
          <Tooltip
            label={
              isEmptyField ? "Please select both guests and a preference" : null
            }
          >
            <Button onClick={onAdd} disabled={isEmptyField}>
              Add
            </Button>
          </Tooltip>
        </Group>
      </Stack>
      <Stack>
        <Title order={1} c={"primary"}>
          Your Seating Preferences
        </Title>
        {isRelationsSuccess &&
        !isRelationsFetching &&
        !isNil(guests) &&
        columns ? (
          <Flex style={{ flex: "1 1", overflowY: "scroll" }}>
            <CustomTable<GuestRelation>
              columns={columns}
              data={relationsData}
              updateRow={mutateUpdateRelation}
              deleteRow={mutateDeleteRelation}
            />
          </Flex>
        ) : isRelationsLoading ? (
          <Loader size="lg" color="primary" />
        ) : isRelationsError ? (
          <Text>Oops! Something went wrong. Please try again later.</Text>
        ) : null}
      </Stack>
    </Stack>
  );
};

export { Preferences };
