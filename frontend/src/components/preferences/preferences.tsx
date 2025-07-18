import {
  Text,
  Flex,
  Input,
  Stack,
  InputBase,
  InputLabel,
  Combobox,
  useCombobox,
  Autocomplete,
  Title,
  Group,
  Button,
  Tooltip,
  Container,
} from "@mantine/core";
import { isNil } from "lodash";
import { toast } from "react-toastify";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Relation } from "../../types/relation";
import { CustomTable } from "../custom-table/custom-table";
import { GuestRelation } from "../../types/guest-relation";
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
import { OptionType } from "../../types/option-type";
import { Column } from "../../types/column";
import MainLoader from "../mainLoader/MainLoader";

const Preferences: React.FC = () => {
  const { currentEvent } = useEventContext();
  const [columns, setColumns] = useState<Column<GuestRelation>[] | null>(null);
  const {
    guestsData: guests,
    isLoading,
    isFetching,
    isSuccess,
    isError,
  } = useFetchAllGuests(true);
  const [selectedPreference, setSelectedPreference] = useState<string>();
  const [selectedRelation, setSelectedRelation] = useState<Relation>();
  const [selectedGuest, setSelectedGuest] = useState<string | undefined>();
  const [secondSelectedGuest, setSecondSelectedGuest] = useState<
    string | undefined
  >();

  useEffect(() => {
    if (isSuccess && !isFetching && !isNil(guests)) {
      setColumns(relationColumns(guests));
    }
  }, [isSuccess, isFetching, guests]);

  const completeGuestOptionList = useMemo(
    () =>
      guests
        ? guests.map((guest) => ({
            label: guest.name,
            value: guest.id,
          }))
        : [],
    [guests],
  );

  const selectedGuestId = useMemo(() => {
    const selectedOption = completeGuestOptionList.find(
      (guest) => guest.label === selectedGuest,
    );

    return selectedOption?.value ?? "";
  }, [completeGuestOptionList, selectedGuest]);

  const secondSelectedGuestId = useMemo(() => {
    const selectedOption = completeGuestOptionList.find(
      (guest) => guest.label === secondSelectedGuest,
    );

    return selectedOption?.value ?? "";
  }, [completeGuestOptionList, secondSelectedGuest]);

  const guestOptionList: OptionType[] = useMemo(
    () =>
      completeGuestOptionList.filter(
        (option) => option.value !== secondSelectedGuestId,
      ),
    [completeGuestOptionList, secondSelectedGuestId],
  );

  const secondGuestOptionList = useMemo(
    () =>
      completeGuestOptionList.filter(
        (option) => option.value !== selectedGuestId,
      ),
    [completeGuestOptionList, selectedGuestId],
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

  const isGuestRelationExist = useMemo(() => {
    return relationsData?.some(
      (relation) =>
        (relation.firstGuestId === selectedGuestId &&
          relation.secondGuestId === secondSelectedGuestId) ||
        (relation.firstGuestId === secondSelectedGuestId &&
          relation.secondGuestId === selectedGuestId),
    );
  }, [selectedGuestId, secondSelectedGuestId, relationsData]);

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

  const isEmptyField =
    !selectedGuestId || !secondSelectedGuestId || !selectedPreference;

  const onAdd = () => {
    if (selectedGuestId && secondSelectedGuestId && selectedRelation) {
      mutateCreateRelation({
        firstGuestId: selectedGuestId,
        relation: selectedRelation,
        secondGuestId: secondSelectedGuestId,
      });
    }
  };

  const { mutateAsync: mutateCreateRelation, isPending: isCreatePeding } =
    useMutation<GuestRelation, Error, Omit<GuestRelation, "id">>({
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

  const { mutateAsync: mutateUpdateRelation, isPending: isUpdatePending } =
    useMutation<GuestRelation, Error, GuestRelation>({
      mutationFn: (updatedRelation) =>
        updateRelation(
          currentEvent?.id as string,
          updatedRelation,
          updatedRelation.id,
        ),
      onSuccess: () => {
        toast.success("Preference updated successfully");
        refetchRelations();
      },
      onError: () => {
        toast.error("Failed to update preference");
      },
    });

  const { mutateAsync: mutateDeleteRelation, isPending: isDeletePending } =
    useMutation<GuestRelation, Error, string>({
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
    <Stack
      w={"100%"}
      h={"100vh"}
      p={"100 10%"}
      align={"center"}
      gap={40}
      style={{ flex: "1 1", overflow: "hidden" }}
    >
      <MainLoader
        isPending={
          isRelationsLoading ||
          isLoading ||
          isCreatePeding ||
          isUpdatePending ||
          isDeletePending
        }
      />
      <Stack align={"flex-end"} gap={20} w={"100%"}>
        <Flex gap={100} w={"100%"} justify={"space-between"}>
          <Autocomplete
            w={"30%"}
            label={"Guest Name"}
            value={selectedGuest}
            data={guestOptionList}
            onChange={setSelectedGuest}
            placeholder={"Select a guest"}
            error={isError ? "Error fetching guests" : undefined}
          />
          <Stack align={"flex-start"} gap={2} w={"30%"}>
            <InputLabel>Preference</InputLabel>
            <Combobox
              store={combobox}
              onOptionSubmit={(preference) => {
                setSelectedPreference(preference);
                const selectedOption = preferenceOptions.find(
                  (option) => option.label === preference,
                );
                setSelectedRelation(selectedOption?.value);
                combobox.closeDropdown();
              }}
            >
              <Combobox.Target>
                <InputBase
                  w={"100%"}
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
            w={"30%"}
            label={"Guest Name"}
            value={secondSelectedGuest}
            data={secondGuestOptionList}
            placeholder={"Select a guest"}
            onChange={setSecondSelectedGuest}
            error={isError ? "Error fetching guests" : undefined}
          />
        </Flex>
        <Group mt={"md"}>
          <Button radius={"md"} onClick={reset} variant={"outline"}>
            Clear
          </Button>
          <Tooltip
            label={
              isEmptyField
                ? "Please select both guests and a preference"
                : isGuestRelationExist
                  ? "Preference for these guests already exists"
                  : null
            }
            disabled={!isEmptyField && !isGuestRelationExist}
          >
            <Button
              radius={"md"}
              onClick={onAdd}
              disabled={isEmptyField || isGuestRelationExist}
            >
              Add
            </Button>
          </Tooltip>
        </Group>
      </Stack>
      <Stack align="center" style={{ flex: "1 1", overflow: "hidden" }}>
        <Title order={1} c={"primary"}>
          Your Seating Preferences
        </Title>
        {isRelationsSuccess &&
        !isRelationsFetching &&
        !isNil(guests) &&
        columns ? (
          <Container size={"xl"} style={{ flex: "1 1", overflow: "hidden" }}>
            <CustomTable<GuestRelation>
              columns={columns}
              data={relationsData}
              updateRow={mutateUpdateRelation}
              deleteRow={mutateDeleteRelation}
            />
          </Container>
        ) : isRelationsError ? (
          <Text>Oops! Something went wrong. Please try again later.</Text>
        ) : null}
      </Stack>
    </Stack>
  );
};

export { Preferences };
